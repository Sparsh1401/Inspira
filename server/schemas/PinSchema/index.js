const graphql = require("graphql");

const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;

const { User } = require("../../models");
const UserType = require("../UserSchema/index");

const PinType = new GraphQLObjectType({
  name: "Pin",
  fields: () => ({
    id: { type: GraphQLID },
    imageUrl: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    link: { type: GraphQLString },
    userId: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findByPk(parent.userId);
      },
    },
  }),
});

module.exports = PinType;
