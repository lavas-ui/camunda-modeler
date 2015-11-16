'use strict';

var browser = require('../util/browser');

// TODO: Unregistering event

function EditorActions(editor) {
  var self = this;

  this.editor = editor;

  browser.on('editor.actions', function(payload) {
    var actions = self.getActions(payload),
        evt = payload.event,
        action = actions[evt];

    // Call the corresponding action function. If an input is active in the document
    // (e.g. the user is currently writing in a textarea) and the ignoreIfActiveInput
    // flag is set, ignore the action.
    if (action && !(action.ignoreIfActiveInput && self.isInputActive())) {
      action.handler();
    }
  });
}

EditorActions.prototype.getActions = function(payload) {
  var editor = this.editor;

  var actions = {
    'file.open': {
      handler: function() {
        editor.openDiagram();
      }
    },
    'file.save': {
      handler: function() {
        editor.save(payload.data.create);
      }
    },
    'file.add': {
      handler: function() {
        editor.addDiagram(payload.data.diagram);
      }
    },
    'editor.new': {
      handler: function() {
        editor.newDiagram(payload.diagramType);
      }
    },
    'editor.close': {
      handler: function() {
        editor.closeDiagram(editor.currentDiagram);
      }
    },
    'editor.quit': {
      handler: function() {
        editor.quit();
      }
    },

    // Edit (BPMN)
    'bpmn.spaceTool': {
      handler: function() {
        editor.trigger('spaceTool');
      },
      ignoreIfActiveInput: true
    },
    'bpmn.lassoTool': {
      handler: function() {
        editor.trigger('lassoTool');
      },
      ignoreIfActiveInput: true
    },
    'bpmn.directEditing': {
      handler: function() {
        editor.trigger('directEditing');
      },
      ignoreIfActiveInput: true
    },
    'bpmn.moveCanvas': {
      handler: function() {
        editor.trigger('moveCanvas', payload.data);
      },
      ignoreIfActiveInput: true
    },
    'bpmn.selectElements': {
      handler: function() {
        editor.trigger('selectElements', payload.data);
      },
      ignoreIfActiveInput: true
    },
    'bpmn.removeSelection': {
      handler: function() {
        editor.trigger('removeSelection', payload.data);
      }
    },
    // Edit (DMN)
    'dmn.ruleAdd': {
      handler: function() {
        editor.trigger('ruleAdd');
      },
      ignoreIfActiveInput: true
    },
    'dmn.ruleAddAbove': {
      handler: function() {
        editor.trigger('ruleAddAbove');
      },
      ignoreIfActiveInput: true
    },
    'dmn.ruleAddBelow': {
      handler: function() {
        editor.trigger('ruleAddBelow');
      },
      ignoreIfActiveInput: true
    },
    'dmn.ruleRemove': {
      handler: function() {
        editor.trigger('ruleRemove');
      },
      ignoreIfActiveInput: true
    },
    'dmn.ruleClear': {
      handler: function() {
        editor.trigger('ruleClear');
      },
      ignoreIfActiveInput: true
    },

    'dmn.clauseAdd': {
      handler: function() {
        editor.trigger('clauseAdd');
      },
      ignoreIfActiveInput: true
    },
    'dmn.clauseAddLeft': {
      handler: function() {
        editor.trigger('clauseAddLeft');
      },
      ignoreIfActiveInput: true
    },
    'dmn.clauseAddRight': {
      handler: function() {
        editor.trigger('clauseAddRight');
      },
      ignoreIfActiveInput: true
    },
    'dmn.clauseRemove': {
      handler: function() {
        editor.trigger('clauseRemove');
      },
      ignoreIfActiveInput: true
    },

    'editor.undo': {
      handler: function() {
        editor.trigger('undo');
      }
    },
    'editor.redo': {
      handler: function() {
        editor.trigger('redo');
      }
    },
    'editor.stepZoom': {
      handler: function() {
        editor.trigger('stepZoom', payload.data);
      }
    },
    'editor.zoom': {
      handler: function() {
        editor.trigger('zoom', payload.data);
      }
    }
  };

  return actions;
};

/**
* Returns true, if an input or textarea element is currently active
*/
EditorActions.prototype.isInputActive = function() {
  var tagName = document.activeElement.tagName;

  return tagName === 'TEXTAREA' || tagName === 'INPUT';
};

module.exports = EditorActions;