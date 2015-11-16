'use strict';

var app = require('app'),
    browserOpen = require('open');

var CANVAS_MOVE_SPEED = 20;

function getEditMenu(browserWindow, notation) {
  // BPMN modeling actions
  var bpmnActions = [
    {
      label: 'Space Tool',
      accelerator: 'S',
      click: function() {
        browserWindow.webContents.send('editor.actions', { event: 'bpmn.spaceTool' });
      }
    },
    {
      label: 'Lasso Tool',
      accelerator: 'L',
      click: function() {
        browserWindow.webContents.send('editor.actions', { event: 'bpmn.lassoTool' });
      }
    },
    {
      id: 'bpmn:directEditing',
      label: 'Direct Editing',
      accelerator: 'E',
      click: function() {
        browserWindow.webContents.send('editor.actions', { event: 'bpmn.directEditing' });
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Move Canvas',
      submenu: [
        {
          label: 'Move Up',
          accelerator: 'Up',
          click: function() {
            browserWindow.webContents.send('editor.actions', {
              event: 'bpmn.moveCanvas',
              data: {
                speed: CANVAS_MOVE_SPEED,
                direction: 'up'
              }
            });
          }
        },
        {
          label: 'Move Left',
          accelerator: 'Left',
          click: function() {
            browserWindow.webContents.send('editor.actions', {
              event: 'bpmn.moveCanvas',
              data: {
                speed: CANVAS_MOVE_SPEED,
                direction: 'left'
              }
            });
          }
        },
        {
          label: 'Move Down',
          accelerator: 'Down',
          click: function() {
            browserWindow.webContents.send('editor.actions', {
              event: 'bpmn.moveCanvas',
              data: {
                speed: CANVAS_MOVE_SPEED,
                direction: 'down'
              }
            });
          }
        },
        {
          label: 'Move Right',
          accelerator: 'Right',
          click: function() {
            browserWindow.webContents.send('editor.actions', {
              event: 'bpmn.moveCanvas',
              data: {
                speed: CANVAS_MOVE_SPEED,
                direction: 'right'
              }
            });
          }
        }
      ]
    },
    {
      label: 'Select All',
      accelerator: 'CommandOrControl+A',
      click: function() {
        browserWindow.webContents.send('editor.actions', { event: 'bpmn.selectElements' });
      }
    },
    {
      id: 'bpmn:removeSelected',
      label: 'Remove Selected',
      accelerator: 'Delete',
      click: function() {
        browserWindow.webContents.send('editor.actions', { event: 'bpmn.removeSelection' });
      }
    }
  ];

  // DMN modeling actions
  var dmnActions = [
    {
      label: 'Add Rule...',
      submenu: [
        {
          id: 'dmn:addRule',
          label: 'At End',
          accelerator: '',
          click: function() {
            browserWindow.webContents.send('editor.actions', { event: 'dmn.addRule' });
          }
        },
        {
          id: 'dmn:addRuleAbove',
          label: 'Above Selected',
          accelerator: '',
          click: function() {
            browserWindow.webContents.send('editor.actions', { event: 'dmn.addRuleAbove' });
          }
        },
        {
          id: 'dmn:addRuleBelow',
          label: 'Below Selected',
          accelerator: '',
          click: function() {
            browserWindow.webContents.send('editor.actions', { event: 'dmn.addRuleBelow' });
          }
        }
      ]
    },
    {
      id: 'dmn:clearRule',
      label: 'Clear Rule',
      accelerator: '',
      click: function() {
        browserWindow.webContents.send('editor.actions', { event: 'dmn.clearRule' });
      }
    },
    {
      id: 'dmn:removeRule',
      label: 'Remove Rule',
      accelerator: '',
      click: function() {
        browserWindow.webContents.send('editor.actions', { event: 'dmn.removeRule' });
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Add Clause...',
      submenu: [
        {
          id: 'dmn:addClause',
          label: 'At End',
          accelerator: '',
          click: function() {
            browserWindow.webContents.send('editor.actions', { event: 'dmn.addClause' });
          }
        },
        {
          id: 'dmn:addClauseLeft',
          label: 'Left of selected',
          accelerator: '',
          click: function() {
            browserWindow.webContents.send('editor.actions', { event: 'dmn.addClauseLeft' });
          }
        },
        {
          id: 'dmn:addClauseRight',
          label: 'Right of selected',
          accelerator: '',
          click: function() {
            browserWindow.webContents.send('editor.actions', { event: 'dmn.addClauseRight' });
          }
        }
      ]
    },
    {
      id: 'dmn:removeClause',
      label: 'Remove Clause',
      accelerator: '',
      click: function() {
        browserWindow.webContents.send('editor.actions', { event: 'dmn.removeClause' });
      }
    }
  ];


  // Base editing actions
  var baseSubmenu = [
    {
      id: 'undo',
      label: 'Undo',
      accelerator: 'CommandOrControl+Z',
      click: function() {
        browserWindow.webContents.send('editor.actions', { event: 'editor.undo' });
      }
    },
    {
      id: 'redo',
      label: 'Redo',
      accelerator: 'CommandOrControl+Y',
      click: function() {
        browserWindow.webContents.send('editor.actions', { event: 'editor.redo' });
      }
    },
    {
      type: 'separator'
    }
  ];

  var modelingActions = notation === 'dmn' ? dmnActions : bpmnActions;

  return {
    id: 'edit',
    label: 'Edit',
    notation: notation,
    submenu: baseSubmenu.concat(modelingActions)
  };
}

module.exports = function(browserWindow, notation) {
  var fileMenu = {
    id: 'file',
    label: 'File',
    submenu: [
      {
        id: 'newFile',
        label: 'New File',
        submenu: [
          {
            id: 'newBpmnFile',
            label: 'BPMN Diagram',
            accelerator: 'CommandOrControl+T',
            click: function() {
              browserWindow.webContents.send('editor.actions', {
                event: 'editor.new',
                diagramType: 'bpmn'
              });
            }
          },
          {
            id: 'newDmnFile',
            label: 'DMN Table',
            click: function() {
              browserWindow.webContents.send('editor.actions', {
                event: 'editor.new',
                diagramType: 'dmn'
              });
            }
          }
        ]
      },
      {
        id: 'openFile',
        label: 'Open File...',
        accelerator: 'CommandOrControl+O',
        click: function() {
          browserWindow.webContents.send('editor.actions', { event: 'file.open' });
        }
      },
      {
        type: 'separator'
      },
      {
        id: 'save',
        label: 'Save File',
        accelerator: 'CommandOrControl+S',
        click: function() {
          browserWindow.webContents.send('editor.actions', {
            event: 'file.save',
            data: {
              create: false
            }
          });
        }
      },
      {
        label: 'Save File As..',
        accelerator: 'CommandOrControl+Shift+S',
        click: function() {
          browserWindow.webContents.send('editor.actions', {
            event: 'file.save',
            data: {
              create: true
            }
          });
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Close Tab',
        accelerator: 'CommandOrControl+W',
        click: function() {
          browserWindow.webContents.send('editor.actions', { event: 'editor.close' });
        }
      },
      {
        id: 'quit',
        label: 'Quit',
        accelerator: 'CommandOrControl+Q',
        click: function() {
          app.quit();
        }
      }
    ]
  };

  var editMenu = getEditMenu(browserWindow, notation);

  var windowMenu = {
    id: 'window',
    label: 'Window',
    submenu: [
      {
        id: 'zoomIn',
        label: 'Zoom In',
        accelerator: 'CommandOrControl+=',
        click: function() {
          browserWindow.webContents.send('editor.actions', {
            event: 'editor.stepZoom',
            data: {
              value: 1
            }
          });
        }
      },
      {
        id: 'zoomIn',
        label: 'Zoom Out',
        accelerator: 'CommandOrControl+-',
        click: function() {
          browserWindow.webContents.send('editor.actions', {
            event: 'editor.stepZoom',
            data: {
              value: -1
            }
          });
        }
      },
      {
        id: 'zoomDefault',
        label: 'Zoom Default',
        accelerator: 'CommandOrControl+0',
        click: function() {
          browserWindow.webContents.send('editor.actions', {
            event: 'editor.zoom',
            data: {
              value: 1
            }
          });
        }
      },
      {
        type: 'separator'
      },
      {
        id: 'reload',
        label: 'Reload',
        accelerator: 'CommandOrControl+R',
        click: function() {
          browserWindow.reload();
        }
      },
      {
        id: 'fullscreen',
        label: 'Fullscreen',
        accelerator: 'F11',
        click: function() {
          if (browserWindow.isFullScreen()) {
            return browserWindow.setFullScreen(false);
          }

          browserWindow.setFullScreen(true);
        }
      },
      {
        id: 'devTools',
        label: 'Toggle DevTools',
        accelerator: 'F12',
        click: function() {
          browserWindow.toggleDevTools();
        }
      }
    ]
  };

  var helpMenu = {
    label: 'Help',
    submenu: [
      {
        label: 'Forum (bpmn.io)',
        click: function() {
          browserOpen('https://forum.bpmn.io/');
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'BPMN 2.0 Tutorial',
        click: function() {
          browserOpen('https://camunda.org/bpmn/tutorial/');
        }
      },
      {
        label: 'BPMN Modeling Reference',
        click: function() {
          browserOpen('https://camunda.org/bpmn/reference/');
        }
      }
    ]
  };

  return [
    fileMenu,
    editMenu,
    windowMenu,
    helpMenu
  ];
};