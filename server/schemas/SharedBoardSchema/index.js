const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;
const PinType = require("../PinSchema/index");
const { Pin, BoardPin } = require("../../models");

const SharedBoardType = new GraphQLObjectType({
  name: "SharedBoard",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    ownerId: { type: GraphQLString },
    collaborators: { type: GraphQLString }, // JSON string
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    pins: {
      type: new GraphQLList(PinType),
      async resolve(parent, args) {
        const boardPins = await BoardPin.findAll({
          where: { boardId: parent.id },
        });
        const pinIds = boardPins.map((bp) => bp.pinId);
        return Pin.findAll({
          where: { id: pinIds },
        });
      },
    },
  }),
});

module.exports = SharedBoardType;
