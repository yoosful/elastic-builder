'use strict';

const _ = require('lodash');

const {
    Query,
    util: { checkType, recursiveToJSON }
} = require('../../core');

/**
 * A query that matches documents matching boolean combinations of other queries.
 * The bool query maps to Lucene `BooleanQuery`. It is built using one or more
 * boolean clauses, each clause with a typed occurrence.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html)
 *
 * @extends Query
 */
class BoolQuery extends Query {

    /**
     * Creates an instance of `BoolQuery`
     */
    constructor() {
        super('bool');
    }

    /**
     * Add given query to list of queries under given clause.
     *
     * @private
     * @param {string} clause
     * @param {Query} query
     * @throws {TypeError} If query is not an instance of `Query`
     */
    _addQuery(clause, query) {
        checkType(query, Query);

        this._queryOpts[clause].push(query);
    }

    /**
     * Add given query array or query to list of queries under given clause.
     *
     * @private
     * @param {string} clause
     * @param {Array<Query>|Query} queries List of valid `Query` objects or a `Query` object
     * @throws {TypeError} If Array item or query is not an instance of `Query`
     */
    _addQueries(clause, queries) {
        if (!_.has(this._queryOpts, clause)) this._queryOpts[clause] = [];

        if (_.isArray(queries)) _.invokeMap(queries, qry => this._addQuery(clause, qry));
        else this._addQuery(clause, queries);
    }

    /**
     * Adds `must` query to boolean container.
     * The clause (query) **must** appear in matching documents and will contribute to the score.
     *
     * @param {Array<Query>|Query} queries List of valid `Query` objects or a `Query` object
     * @returns {BoolQuery} returns `this` so that calls can be chained.
     * @throws {TypeError} If Array item or query is not an instance of `Query`
     */
    must(queries) {
        this._addQueries('must', queries);
        return this;
    }

    /**
     * Adds `filter` query to boolean container.
     * The clause (query) **must** appear in matching documents. However unlike `must` the score
     * of the query will be ignored. Filter clauses are executed in filter context, meaning that
     * scoring is ignored and clauses are considered for caching.
     *
     * @param {Array<Query>|Query} queries List of valid `Query` objects or a `Query` object
     * @returns {BoolQuery} returns `this` so that calls can be chained.
     * @throws {TypeError} If Array item or query is not an instance of `Query`
     */
    filter(queries) {
        this._addQueries('filter', queries);
        return this;
    }

    /**
     * Adds `must_not` query to boolean container.
     * The clause (query) **must not** appear in the matching documents.
     * Clauses are executed in filter context meaning that scoring is ignored
     * and clauses are considered for caching. Because scoring is ignored,
     * a score of 0 for all documents is returned.
     *
     * @param {Array<Query>|Query} queries List of valid `Query` objects or a `Query` object
     * @returns {BoolQuery} returns `this` so that calls can be chained.
     * @throws {TypeError} If Array item or query is not an instance of `Query`
     */
    mustNot(queries) {
        this._addQueries('must_not', queries);
        return this;
    }

    /**
     * Adds `should` query to boolean container.
     * The clause (query) **should** appear in the matching document. In a boolean query with
     * no must or filter clauses, one or more should clauses must match a document.
     * The minimum number of should clauses to match can be set using the
     * `minimum_should_match` parameter.
     *
     * @param {Array<Query>|Query} queries List of valid `Query` objects or a `Query` object
     * @returns {BoolQuery} returns `this` so that calls can be chained.
     * @throws {TypeError} If Array item or query is not an instance of `Query`
     */
    should(queries) {
        this._addQueries('should', queries);
        return this;
    }

    /**
     * Enables or disables similarity coordinate scoring of documents
     * commoning the `CommonTermsQuery`. Default: false.

     * @param {boolean} enable
     * @returns {BoolQuery} returns `this` so that calls can be chained.
     */
    disableCoord(enable) {
        this._queryOpts.disable_coord = enable;
        return this;
    }

    /**
     * Sets the value controlling how many `should` clauses in the boolean
     * query should match. It can be an absolute value (2), a percentage (30%)
     * or a combination of both. By default no optional clauses are necessary for a match.
     * However, if the bool query is used in a filter context and it has `should` clauses then,
     * at least one `should` clause is required to match.
     *
     * @param {string|number} minimumShouldMatch An absolute value (2), a percentage (30%)
     * or a combination of both.
     * @returns {BoolQuery} returns `this` so that calls can be chained.
     */
    minimumShouldMatch(minimumShouldMatch) {
        this._queryOpts.minimum_should_match = minimumShouldMatch;
        return this;
    }

    /**
     * Sets if the `Query` should be enhanced with a `MatchAllQuery` in order
     * to act as a pure exclude when only negative (mustNot) clauses exist. Default: true.
     *
     * @param {boolean} enable
     * @returns {BoolQuery} returns `this` so that calls can be chained.
     */
    adjustPureNegative(enable) {
        this._queryOpts.adjust_pure_negative = enable;
        return this;
    }

    /**
     * Override default `toJSON` to return DSL representation of the compound query
     * class instance.
     *
     * @override
     * @returns {Object} returns an Object which maps to the elasticsearch query DSL
     */
    toJSON() {
        const cleanQryOpts = _.reduce(
            // Pick the clauses which have some queries
            _.filter(
                ['must', 'filter', 'must_not', 'should'],
                clause => _.has(this._queryOpts, clause)
            ),
            // Unwrap array and put into qryOpts if required
            (qryOpts, clause) => {
                const clauseQueries = this._queryOpts[clause];
                qryOpts[clause] = recursiveToJSON(
                    clauseQueries.length === 1 ? _.head(clauseQueries) : clauseQueries
                );
                return qryOpts;
            },
            // initial value
            {}
        );

        return {
            [this.type]: cleanQryOpts
        };
    }
}

module.exports = BoolQuery;
