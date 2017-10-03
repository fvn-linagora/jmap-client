'use strict';

import Model from './Model.js';
import Utils from '../utils/Utils.js';

export default class Thread extends Model {
  /**
   * This class represents a JMAP [Thread]{@link http://jmap.io/spec.html#threads}.
   *
   * @constructor
   * @extends Model
   *
   * @param jmap {Client} The {@link Client} instance that created this _Thread_.
   * @param id {String} The unique identifier of this _Thread_.
   * @param [opts] {Object} The optional properties of this _Thread_.
   * @param [opts.messageIds=[]] {String[]} An array of message identifiers contained in this _Thread_.
   *
   * @see Model
   */
  constructor(jmap, id, opts) {
    super(jmap);

    Utils.assertRequiredParameterIsPresent(id, 'id');

    opts = opts || {};

    this.id = id;
    this.messageIds = opts.messageIds || [];
  }

  /**
   * Fetches all messages contained in this _Thread_.<br />
   * This will delegate to {@link Client#getMessages}, passing this Thread's _messageIds_ as the _ids_ option.
   *
   * @param [options] {Object} The options object passed to {@link Client#getMessages}.
   *   Please note that the _ids_ option will be overriden if defined.
   * @returns {Promise} A promise that eventually resolves with an array of {@link Message} instances.
   *
   * @see Client#getMessages
   * @see PromiseProvider
   */
  getMessages(options) {
    options = options || {};
    options.ids = this.messageIds;

    return this._jmap.getMessages(options);
  }

  /**
   * Updates the isFlagged field of all {@link Message}s of this {@link Thread}.
   *
   * @param isFlagged {Boolean} The isFlagged field of the thread.
   *
   * @return {Promise} A {@link Promise}, as per {@link Client.setMessages}.
   *
   * @see Client#setMessages
   */
  setIsFlagged(isFlagged) {
    Utils.assertRequiredParameterHasType(isFlagged, 'isFlagged', 'boolean');

    return this._updateAllMessages({ keywords: {$Flagged: isFlagged }});
  }

  /**
   * Updates the isUnread field of this {@link Message}.
   *
   * @param isUnread {Boolean} The isUnread field of the thread.
   *
   * @return {Promise} A {@link Promise}, as per {@link Client.setMessages}.
   *
   * @see Client#setMessages
   */
  setIsUnread(isUnread) {
    Utils.assertRequiredParameterHasType(isUnread, 'isUnread', 'boolean');

    return this._updateAllMessages({ keywords: {$Seen: !isUnread }});
  }

  /**
   * Moves this {@link Thread} to a different set of mailboxes.
   *
   * @param mailboxIds {String[]} The identifiers of the target mailboxes for the thread.
   *
   * @return {Promise} A {@link Promise}, as per {@link Client.setMessages}.
   *
   * @see Client#setMessages
   */
  move(mailboxIds) {
    return this._updateAllMessages({ mailboxIds });
  }

  /**
   * Moves this {@link Thread} to the mailbox holding the given `role`.<br />
   * This will first do a JMAP request to find the mailbox with the given role, then a {@link Thread#move} to move the message.
   *
   * @param role {MailboxRole|String} The desired mailbox role.
   *
   * @return {Promise} A {@link Promise}, as per {@link Thread#move}.
   *
   * @see MailboxRole
   * @see Client#getMailboxWithRole
   */
  moveToMailboxWithRole(role) {
    return this._jmap.getMailboxWithRole(role).then(mailbox => this.move([mailbox.id]));
  }

  /**
   * Destroy this {@link Thread} on the server.<br />
   * This will internally destory all messages contained in this thread.
   *
   * @return {Promise} A {@link Promise}, as per {@link Client.destroyMessages}.
   *
   * @see Client#destroyMessages
   */
  destroy() {
    return this._jmap.destroyMessages(this.messageIds);
  }

  _updateAllMessages(updates) {
    let options = {};

    this.messageIds.forEach(id => {
      options[id] = updates;
    });

    return this._jmap.setMessages({ update: options });
  }

  /**
   * Creates a _Thread_ from its JSON representation.
   *
   * @param jmap {Client} The {@link Client} instance passed to the _Thread_ constructor.
   * @param object {Object} The JSON representation of the _Thread_, as a Javascript object.
   * @param object.id {String} The identifier of the _Thread_.
   *
   * @return {Thread}
   */
  static fromJSONObject(jmap, object) {
    Utils.assertRequiredParameterIsPresent(object, 'object');

    return new Thread(jmap, object.id, object);
  }
}
