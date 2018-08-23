'use strict';

export default class FilterRuleCondition {
  /**
   * This class represents a JMAP [FilterRuleCondition]{@link http://jmap.io/spec.html#messages}.<br />
   * An _FilterRuleCondition_ object holds the name and email address of either a sender or a recipient of a {@link Message}.
   *
   * @param [opts] {Object} The optional properties of this _FilterRuleCondition_.
   * @param [opts.field=''] {String} The _field_ on which condition applies.
   * @param [opts.comparator='contains'] {String} The _comparator_ to be used in FilterRuleCondition.
   * @param [opts.value='contains'] {String} The _value_ to compare specific _field_ with.
   */
  constructor(opts) {
    opts = opts || {};

    this.field = opts.field || '';
    this.comparator = opts.comparator || 'contains';
    this.value = opts.value || '';
  }

  /**
   * Creates a _FilterRuleCondition_ from its JSON representation.
   *
   * @param jmap {Client} The {@link Client} instance that originates the _FilterRuleCondition_ instance. Is actually ignored.
   * @param object {Object} The JSON representation of the _FilterRuleCondition_, as a Javascript object
   *
   * @return {FilterRuleCondition}
   */
  static fromJSONObject(jmap, object) {
    return new FilterRuleCondition(object);
  }
}
