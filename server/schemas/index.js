const graphql = require("graphql");
const { User, Pin, SavedPins, SharedBoard, BoardPin } = require("../models");
const { Op } = require("sequelize");

//TypeDefs
const UserType = require("./UserSchema/index");
const PinType = require("./PinSchema/index");
const SavedPinType = require("./SavedPinsSchema/index");
const SharedBoardType = require("./SharedBoardSchema/index");

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
} = graphql;

//RootQuery
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    latestPins: {
      type: new GraphQLList(PinType),
      resolve(parent, args) {
        return Pin.findAll({
          order: [["updatedAt", "DESC"]],
          limit: 20,
        });
      },
    },

    myPins: {
      type: new GraphQLList(PinType),
      args: { userId: { type: graphql.GraphQLID } },
      resolve(parent, args) {
        return Pin.findAll({
          where: {
            userId: args.userId,
          },
        });
      },
    },

    getPinByImageURL: {
      type: new GraphQLList(PinType),
      args: { imageUrl: { type: GraphQLString } },
      resolve(parent, args) {
        return Pin.findAll({
          where: {
            imageUrl: args.imageUrl,
          },
        });
      },
    },

    getSavedPins: {
      type: new GraphQLList(PinType),
      args: { googleId: { type: GraphQLString } },
      async resolve(parent, args) {
        if (!args.googleId) {
          return [];
        }
        
        const savedPins = await SavedPins.findAll({
          where: {
            googleId: args.googleId,
          },
        });
        
        // If no saved pins, return empty array
        if (!savedPins || savedPins.length === 0) {
          return [];
        }
        
        // Get the imageUrls from saved pins
        const imageUrls = savedPins.map(sp => sp.imageUrl).filter(url => url);
        
        // If no valid imageUrls, return empty array
        if (imageUrls.length === 0) {
          return [];
        }
        
        // Find all pins that match these imageUrls
        const pins = await Pin.findAll({
          where: {
            imageUrl: {
              [Op.in]: imageUrls,
            },
          },
        });
        
        return pins || [];
      },
    },

    getPin: {
      type: PinType,
      args: { id: { type: graphql.GraphQLID } },
      resolve(parent, args) {
        return Pin.findByPk(args.id);
      },
    },

    getBoards: {
      type: new GraphQLList(SharedBoardType),
      args: { userId: { type: graphql.GraphQLID } },
      resolve(parent, args) {
        return SharedBoard.findAll({
          where: {
            [Op.or]: [
              { ownerId: args.userId },
              { collaborators: { [Op.like]: `%"${args.userId}"%` } }
            ]
          }
        });
      },
    },

    getBoard: {
      type: SharedBoardType,
      args: { id: { type: graphql.GraphQLID } },
      resolve(parent, args) {
        return SharedBoard.findByPk(args.id);
      },
    },
  },
});

//Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // REGISTERS USER MUTATION
    createUser: {
      type: UserType,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        googleId: { type: GraphQLString },
      },
      resolve(parent, args) {
        User.create({
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          googleId: args.googleId,
        }).catch((err) => {
          console.log(err);
        });
      },
    },

    // CREATE PIN MUTATION
    createPin: {
      type: PinType,
      args: {
        imageUrl: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        link: { type: GraphQLString },
        userId: { type: GraphQLString },
      },
      resolve(parent, args) {
        Pin.create({
          imageUrl: args.imageUrl,
          title: args.title,
          description: args.description,
          link: args.link,
          userId: args.userId,
        }).catch((err) => {
          console.log(err);
        });
      },
    },

    // DELETE PIN MUTATION
    deletePin: {
      type: PinType,
      args: {
        imageUrl: { type: GraphQLString },
      },
      resolve(parent, args) {
        Pin.destroy({
          where: {
            imageUrl: args.imageUrl,
          },
        }).catch((err) => {
          console.log(err);
        });
      },
    },

    // SAVE PIN MUTATION
    savePin: {
      type: PinType,
      args: {
        googleId: { type: GraphQLString },
        imageUrl: { type: GraphQLString },
      },
      async resolve(parent, args) {
        if (!args.googleId || !args.imageUrl) {
          throw new Error("googleId and imageUrl are required");
        }
        
        // First verify the pin exists in the Pin table
        const pin = await Pin.findOne({
          where: {
            imageUrl: args.imageUrl,
          },
        });
        
        if (!pin) {
          throw new Error("Pin not found. Cannot save a pin that doesn't exist.");
        }
        
        // Check if pin is already saved
        const existing = await SavedPins.findOne({
          where: {
            googleId: args.googleId,
            imageUrl: args.imageUrl,
          },
        });
        
        if (existing) {
          // Return the pin if already saved
          return pin;
        }
        
        // Save the pin
        await SavedPins.create({
          googleId: args.googleId,
          imageUrl: args.imageUrl,
        });
        
        // Return the full pin object
        return pin;
      },
    },

    createBoard: {
      type: SharedBoardType,
      args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        ownerId: { type: GraphQLString },
      },
      resolve(parent, args) {
        return SharedBoard.create({
          title: args.title,
          description: args.description,
          ownerId: args.ownerId,
          collaborators: "[]",
        });
      },
    },

    addCollaborator: {
      type: SharedBoardType,
      args: {
        boardId: { type: graphql.GraphQLID },
        email: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const board = await SharedBoard.findByPk(args.boardId);
        if (!board) throw new Error("Board not found");
        
        const collaborators = JSON.parse(board.collaborators || "[]");
        if (!collaborators.includes(args.email)) {
          collaborators.push(args.email);
          board.collaborators = JSON.stringify(collaborators);
          await board.save();
        }
        return board;
      },
    },

    addPinToBoard: {
      type: PinType,
      args: {
        boardId: { type: graphql.GraphQLID },
        pinId: { type: graphql.GraphQLID },
      },
      async resolve(parent, args) {
        await BoardPin.create({
          boardId: args.boardId,
          pinId: args.pinId,
        });
        return Pin.findByPk(args.pinId);
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });
