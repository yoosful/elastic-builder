'use strict';

const PipelineAggregationBase = require('./pipeline-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-stats-bucket-aggregation.html';

/**
 * A sibling pipeline aggregation which calculates a variety of stats across
 * all bucket of a specified metric in a sibling aggregation. The specified
 * metric must be numeric and the sibling aggregation must be a multi-bucket
 * aggregation.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-stats-bucket-aggregation.html)
 *
 * @extends PipelineAggregationBase
 */
class StatsBucketAggregation extends PipelineAggregationBase {
    /**
     * Creates an instance of `StatsBucketAggregation`
     *
     * @param {string} name The name which will be used to refer to this aggregation.
     * @param {string=} bucketsPath The relative path of metric to aggregate over
     */
    constructor(name, bucketsPath) {
        super(name, 'stats_bucket', ES_REF_URL, bucketsPath);
    }
}

module.exports = StatsBucketAggregation;
