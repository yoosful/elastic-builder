'use strict';

const PipelineAggregationBase = require('./pipeline-aggregation-base');

const ES_REF_URL =
    'https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-sum-bucket-aggregation.html';

/**
 * A sibling pipeline aggregation which calculates the sum across all bucket
 * of a specified metric in a sibling aggregation. The specified metric must
 * be numeric and the sibling aggregation must be a multi-bucket aggregation.
 *
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-sum-bucket-aggregation.html)
 *
 * @extends PipelineAggregationBase
 */
class SumBucketAggregation extends PipelineAggregationBase {
    /**
     * Creates an instance of `SumBucketAggregation`
     *
     * @param {string} name The name which will be used to refer to this aggregation.
     * @param {string=} bucketsPath The relative path of metric to aggregate over
     */
    constructor(name, bucketsPath) {
        super(name, 'sum_bucket', ES_REF_URL, bucketsPath);
    }
}

module.exports = SumBucketAggregation;
