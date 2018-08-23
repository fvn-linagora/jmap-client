'use strict';

import Model from './Model.js';
import FilterRuleCondition from './FilterRuleCondition.js';
import Utils from '../utils/Utils.js';
import JSONBuilder from '../utils/JSONBuilder.js';

class FilterRule extends Model {
  /**
   * This class represents a JMAP [FilterRule]{@link http://jmap.io/spec.html}.<br />
   * The _FilterRule_ object represents the state of incoming message filtering for an account.
   *
   * @constructor
   * @extends Model
   *
   * @param jmap {Client} The {@link Client} instance that created this _FilterRule_.
   * @param [opts] {Object} The optional properties of this _FilterRule_.
   * @param [opts.isEnabled=false] {Boolean} Is the vacation response enabled?
   * @param [opts.isActivated=false] {Boolean} Is the vacation response activated?
   *
   * @see Model
   */
  constructor(jmap, opts) {
    super(jmap);

    opts = opts || {};

    // id: '42-ac',
    // name: self.newFilter.name,
    // condition: {
    //   field: 'from',
    //   comparator: 'exactly-equals',
    //   value: mails
    // },
    // action: {
    //   mailboxIds: [self.newFilter.moveTo.id]
    // }


    this.id = FilterRule.ID;
    this.name = opts.name || null;
    this.condition = opts.condition || null;
    this.action = opts.condition || null;
  
  }

  /**
   * Creates a JSON representation from this {@link FilterRule}.
   *
   * @return JSON object with only owned properties and non-null default values.
   */
  toJSONObject() {
    return new JSONBuilder()
      .append('id', this.id)
      .append('isEnabled', this.isEnabled)
      .appendIfDefined('subject', this.subject)
      .appendIfDefined('textBody', this.textBody)
      .appendIfDefined('htmlBody', this.htmlBody)
      .build();
  }

  /**
   * Creates an _FilterRule_ from its JSON representation.
   *
   * @param jmap {Client} The {@link Client} instance that created this _FilterRule_.
   * @param object {Object} The JSON representation of the _FilterRule_, as a Javascript object.
   *
   * @return {FilterRule}
   */
  static fromJSONObject(jmap, object) {
    Utils.assertRequiredParameterIsPresent(object, 'object');

    return new FilterRule(jmap, object);
  }
}

FilterRule.ID = 'singleton'; // http://jmap.io/spec.html#vacation-response

export default FilterRule;
