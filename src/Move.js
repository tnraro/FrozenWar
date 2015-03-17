var Action = require('./engine/Action.js');
var PositionComponent = require('./Position.js').PositionComponent;
var ComponentGroup = require('./engine/ComponentGroup.js');

/**
 * Stores how much an Entity can move.
 * @constructor
 * @extends Component
 * @param walk {Number} - Max distance of Entity can move in a turn.
 */
function MoveComponent(walk) {
  /**
   * Stores maximum distance of the Entity can move in a turn.
   * @var {Number}
   */
  this.maxStep = step;
  /**
   * Stores current left distance of the Entity.
   * @var {Number}
   */
  this.step = 0;
}

/**
 * Checks if the Entity has a distance left.
 * @returns {Boolean} Whether if the Entity can move.
 */
MoveComponent.prototype.canMove = function() {
  return this.step > 0;
}

/**
 * Checks if the Entity has moved in this turn.
 * @returns {Boolean} Whether if the Entity has moved in the turn.
 */
MoveComponent.prototype.hasMoved = function() {
  return this.step != this.maxStep;
}

/**
 * Heals the Entity's distance limit.
 */
MoveComponent.prototype.heal = function() {
  this.step = this.maxStep;
}

/**
 * Heals Entity's distance limit each turn.
 * @constructor
 * @extends TurnSystem
 */
function MoveHealSystem() {
  this.engine = null;
  this.entities = null;
}

MoveHealSystem.prototype.onAddedToEngine = function(engine) {
  this.engine = engine;
  this.entities = engine.getEntitiesFor(ComponentGroup.createBuilder(engine)
    .contain(MoveComponent).build());
}

MoveHealSystem.prototype.onSequence = function(turn) {
  this.entities.forEach(function(entity) {
    entity.get(MoveComponent).heal();
  });
}

/**
 * Represents an Entity moving to specific position.
 * @constructor
 * @extends Action
 * @param engine {Engine} - The engine.
 * @param entity {Entity} - The entity to move.
 * @param player {Entity} - The player who initiated this action.
 * @param options {PositionComponent} - The point to move the entity.
 * @throws if Entity is out of distance limit
 * @throws if Entity does not have PositionComponent
 */
var MoveAction = Action.scaffold(function(engine) {
  if(!this.entity.has(PositionComponent)) {
    throw new Error('Entity does not have PositionComponent');
  }
  var from = this.entity.get(PositionComponent);
  var moveComp = this.entity.get(MoveComponent);
  // TODO use pathfinding algorithm
  var cost = from.distance(this.options);
  if(cost > moveComp.step) {
    throw new Error('That position is not reachable');
  }
  this.result = {
    x: from.x,
    y: from.y
  };
  moveComp.step -= cost;
  from.x = this.options.x;
  from.y = this.options.y;
}, function(engine, entity, player, options) {
  if(options == null) throw new Error('Options should be a Point object');
  // TODO position validation
  this.options = new PositionComponent(options.x, options.y);
});