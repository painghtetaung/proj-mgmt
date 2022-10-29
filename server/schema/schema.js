//graphql schema

// const { projects, clients } = require('../sampleData.js');

//Mongoose models
const Project = require('../models/Project');
const Client = require('../models/Client');

const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull} = require('graphql');

// Project Type
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: {type: GraphQLID},
        clientId: {type: GraphQLID}, 
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        status: {type: GraphQLString},
        client: {
            type: ClientType,
            resolve(parent, args) {
                return Client.findById(parent.clientId);
            }
        }
    })
});

// Client Type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString}
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                // return projects;
                return Project.find();//mongo data
            },
        },
        project: {
            type: ProjectType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                // return projects.find(project => project.id === args.id);
                return Project.findById(args.id);
            }
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return Client.find();
            },
        },
        client: {
            type: ClientType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Client.findById(args.id);
            }
        }
    }
});

// Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        //Add client
        addClient: {
            type: ClientType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                email: {type: GraphQLNonNull(GraphQLString)},
                phone: {type: GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args) {
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                });

                return client.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});