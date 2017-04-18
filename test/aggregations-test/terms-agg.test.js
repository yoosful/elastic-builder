import test from 'ava';
import { TermsAggregation } from '../../src';
import { setsAggType, validatedCorrectly, makeAggPropIsSetMacro } from '../_macros';

const getInstance = field => new TermsAggregation('my_agg', field);

const aggPropIsSet = makeAggPropIsSetMacro(getInstance, 'my_agg', 'terms');

test(setsAggType, TermsAggregation, 'terms');
test(validatedCorrectly, getInstance, 'collectMode', ['depth_first', 'breadth_first']);
test(aggPropIsSet, 'showTermDocCountError', true);
test(aggPropIsSet, 'collectMode', 'breadth_first');
test(aggPropIsSet, 'order', 'my_field', { my_field: 'desc' });
test(aggPropIsSet, 'order', ['my_field', 'asc'], { my_field: 'asc' });

test('include partition is set', t => {
    const myAgg = getInstance('my_field').includePartition(0, 20).toJSON();
    const expected = {
        my_agg: {
            terms: {
                field: 'my_field',
                include: { partition: 0, num_partitions: 20 }
            }
        }
    };
    t.deepEqual(myAgg, expected);
});

test('order direction is validated', t => {
    t.notThrows(() => getInstance().order('my_field'));
    t.notThrows(() => getInstance().order('my_field', 'asc'));
    t.notThrows(() => getInstance().order('my_field', 'ASC'));
    t.notThrows(() => getInstance().order('my_field', 'desc'));
    t.notThrows(() => getInstance().order('my_field', 'DESC'));

    let err = t.throws(() => getInstance().order('my_field', 'invalid_direction'), Error);
    t.is(err.message, "The 'direction' parameter should be one of 'asc' or 'desc'");

    err = t.throws(() => getInstance().order('my_field', null), Error);
    t.is(err.message, "The 'direction' parameter should be one of 'asc' or 'desc'");
});