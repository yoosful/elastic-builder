'use strict';

const _ = require('lodash');

const JoiningQueryBase = require('./joining-query-base');

const ES_REF_URL = 'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-has-child-query.html';

/**
 * The `has_child` filter accepts a query and the child type to run against, and
 * results in parent documents that have child docs matching the query.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-has-child-query.html)
 *
 * @extends JoiningQueryBase
 */
class HasChildQuery extends JoiningQueryBase {

    /**
     * Creates an instance of `HasChildQuery`
     *
     * @param {Query=} qry A valid `Query` object
     * @param {string=} type The child type
     */
    constructor(qry, type) {
        super('has_child', ES_REF_URL, qry);

        if (!_.isNil(type)) this._queryOpts.child_type = type;
    }

    /**
     * Sets the child document type to search against.
     * Alias for method `childType`.
     *
     * @param {string} type A valid doc type name
     * @returns {HasChildQuery} returns `this` so that calls can be chained.
     */
    type(type) {
        return this.childType(type);
    }

    /**
     * Sets the child document type to search against
     *
     * @param {string} type A valid doc type name
     * @returns {HasChildQuery} returns `this` so that calls can be chained.
     */
    childType(type) {
        this._queryOpts.child_type = type;
        return this;
    }

    /**
     * Specify the minimum number of children are required to match
     * for the parent doc to be considered a match
     *
     * @param {number} limit A positive `integer` value.
     * @returns {NestedQuery} returns `this` so that calls can be chained.
     */
    minChildren(limit) {
        this._queryOpts.min_children = limit;
        return this;
    }

    /**
     * Specify the maximum number of children are required to match
     * for the parent doc to be considered a match
     *
     * @param {number} limit A positive `integer` value.
     * @returns {NestedQuery} returns `this` so that calls can be chained.
     */
    maxChildren(limit) {
        this._queryOpts.max_children = limit;
        return this;
    }
}

module.exports = HasChildQuery;