
const query = require('./query')
const mutations = require('./mutations')

exports.resolvers = {
    Query: query.query,
    Mutation:  mutations.mutations
}