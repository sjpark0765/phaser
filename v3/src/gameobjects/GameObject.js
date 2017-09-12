var Class = require('../utils/Class');
var Components = require('./components');
var DataProxy = require('./components/DataProxy');

/**
 * The base GameObject class that all Game Objects extend.
 *
 * @class GameObject
 *
 * @param {Scene} scene - The Scene to which this Game Object belongs.
 * @param {String} type - A textual representation of the Game Object.
 */
var GameObject = new Class({

    initialize:

    function GameObject (scene, type)
    {
        /**
         * The Scene to which this Game Object belongs.
         *
         * @property {Scene} scene
         */
        this.scene = scene;

        /**
         * A textual representation of this Game Object.
         *
         * @property {String} type
         */
        this.type = type;

        /**
         * The name of this Game Object. Blank by default and not populated by Phaser. Left for developers use.
         *
         * @property {String} [name='']
         */
        this.name = '';

        /**
         * The active state of this Game Object. A Game Object with an active state of `true` is processed by the UpdateList.
         *
         * @property {Boolean} [active=true]
         */
        this.active = true;

        /**
         * The Tab Index of this Game Object.
         *
         * @property {Integer} [tabIndex=-1]
         */
        this.tabIndex = -1;

        /**
         * A proxy to the Data class. It allows you to store and query key/value paired information specific to this Game Object.
         *
         * @property {DataProxy} data
         */
        this.data = new DataProxy(scene, this);

        /**
         * The bitmask that determines if the Game Object will render or not.
         * Structure: 0001 | 0010 | 0100 | 1000
         * The components: Visible, Alpha, Transform and Texture set bits in this mask respectively
         *
         * @property {Integer} [renderMask=15]
         * @private
         */
        this.renderMask = 15;

        /**
         * The flags that the renderMask uses to determine if the Game Object will render or not.
         *
         * @property {Integer} [renderFlags=15]
         * @private
         */
        this.renderFlags = 15;

        /**
         * A bitmask that controls if this Game Object is drawn by a Camera or not.
         *
         * @property {Number} [cameraFilter=0]
         * @private
         */
        this.cameraFilter = 0;

        /**
         * If this Game Object is enabled for input then this property will contain a Phaser.Input.InteractiveObject reference.
         *
         * @property {Phaser.Input.InteractiveObject|null} [input=null]
         */
        this.input = null;

        /**
         * If this Game Object is enabled for physics then this property will contain a reference to a Physics Body.
         *
         * @property {Phaser.Physics.Body|null} [body=null]
         */
        this.body = null;

        //  Tell the Scene to re-sort the children
        this.scene.sys.sortChildrenFlag = true;
    },

    /**
     * Sets the `active` property of this Game Object and returns this Game Object for further chaining.
     *
     * @method GameObject#setActive
     *
     * @param {Boolean} value - True if this Game Object should be set as active, false if not.
     * @return {GameObject} This GameObject.
     */
    setActive: function (value)
    {
        this.active = value;

        return this;
    },

    /**
     * Sets the `name` property of this Game Object and returns this Game Object for further chaining.
     *
     * @method GameObject#setName
     *
     * @param {String} value - The name to be given to this Game Object.
     * @return {GameObject} This GameObject.
     */
    setName: function (value)
    {
        this.name = value;

        return this;
    },

    /**
     * Pass this Game Object to the Input Manager to enable it for Input.
     *
     * @method GameObject#setInteractive
     *
     * @param {[type]} [shape] - A geometric shape that defines the hit area for the Game Object. If not specified a Rectangle will be used.
     * @param {Function} [callback] - A callback to be invoked when the Game Object is interacted with.
     * @return {GameObject} This GameObject.
     */
    setInteractive: function (shape, callback)
    {
        this.scene.sys.inputManager.enable(this, shape, callback);

        return this;
    },

    //  To be overridden by custom GameObjects. Allows base objects to be used in a Pool.
    update: function ()
    {
    },

    /**
     * Returns a JSON representation of the Game Object.
     *
     * @method GameObject#toJSON
     *
     * @return {Object} A JSON representation of the Game Object.
     */
    toJSON: function ()
    {
        return Components.ToJSON(this);
    },

    /**
     * Compares the renderMask with the renderFlags to see if this Game Object will render or not.
     *
     * @method GameObject#willRender
     *
     * @return {Boolean} True if the Game Object should be rendered, otherwise false.
     */
    willRender: function ()
    {
        return (this.renderMask === this.renderFlags);
    },

    /**
     * Destroys this Game Object, removing it from the Display List and Update List.
     * Also removes it from the Input and Physics Managers if enabled.
     * Sets the active state to `false`. Use this to remove a Game Object from your game if
     * you don't plan to use it again later. If you do wish to use it later then look at using
     * the Game Object Pool class instead.
     *
     * @method GameObject#destroy
     */
    destroy: function ()
    {
        this.scene.sys.displayList.remove(this);
        this.scene.sys.updateList.remove(this);

        if (this.input)
        {
            this.scene.sys.inputManager.clear(this);
        }

        if (this.body)
        {
            this.scene.sys.physicsManager.remove(this);
        }

        this.active = false;

        this.scene = undefined;
    }

});

module.exports = GameObject;
