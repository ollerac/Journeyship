### working on now:
- need to implement loading indicator and stop the browser from freezing when loading big projects

### launch date: monday, september 9th
- canvas performance, pre-render all blocks
  - no: maybe store references to these canvas blocks on special properties of the mainArea and editorArea and then also in the data attributes of the color palette animated elements?
    -instead: store the reference to the canvas blocks on the animated blocks themselves, then just update all animated blocks with the same id when one of them is updated. be careful what you give the same id.
  - all animated blocks in the main canvas should have the same id as the block they were painted from, unless they were edited afterwards by selecting a block
  - add pre-rendered blocks on load
    - each animated block in main color palette
    - each animated block in main canvas area (fg and bg), if it doesn't have the same id as one already in the main color palette
  - add pre-rendered block on update
    - updating an editor block that's from the main color palette
    - updating a main canvas block (and the corresponding main color palette block if there is one)
  - change how animations happen, grab from pre-rendered blocks
    - editor block animation
    - each main color palette animated block
    - each main canvas block (fg and bg) animated block
- more starting blocks, like trees and people and dogs and flowing water and boats
- add footer
  - creative commons license info 
  - github link
  - social share buttons

- simple howto video or guided javascript walkthrough
  - use hopscotch

### after launch
- invite people

### after launch
- minify and concatenate js
- start using a css preprocessor
- use cache breaker (part of yeoman or grunt or bower?)

### next cycle
- movement blocks
  - button: 'reset position' for blocks that have been moved
- checkbox: only show the selected layer
- gotta look into performance issues: look at http://journeyship.com/4 in firefox
- don't use selected block to carry info about movement type, just use animated block
- separate main js file into modules and concatenate and minify on deploy
- selected block follows mouse on canvas
- show a list of recently created journeyships
- undo!!!
  - after every change make a copy of the major areas and put them in a queue, when user presses undo pop the last thing put in the que and load it
    - make general savedata function for this and for the general save
- give palette blocks a light checkered gray background so it's clear that transparent blocks are transparent
- make blocks that can move!
  - add checkbox: "Show mover blocks" (only if there's one on the canvas)
  - show message: "Only blocks placed on the foreground layer can move"
- add a blinking arrow to show where the editor area is after clicking the new button or after selecting a block on the main canvas and clicking edit
- make blocks follow mouse and snap to block position
- ? make animated blocks simple arrays, use angularjs
- make scenes: each new scene clears the main canvas and resets all of its animated blocks
- look into the getNextAnimationFrame method for canvas
- look through priorities and organize them
- organize code
- simplify data model

### first priority:
- select should open edit
- blocks being edited should automatically update their source
  - maybe don't copy the animated block, edit it directly
- drag layers up and down in editor

### would be *really* nice to have:
- replace other setIntervals with requestAnimationFrame
- maybe lighten the backgrounds a bit
- after user accounts: save blocks from other people's projects into yours
- edit more space, more than one block
  - make all blocks bigger?
  - the ability to select and edit multiple adjacent layers?
- ! export to movie file
- movie view (without the editor or palettes)
- export to data (native canvas option?)
- import data (native canvas option?)
- use getNextAnimationFrame instead of setInterval
- enhancement: selecting a block should open the editor
- add 'mirror vertical' and 'mirror horizontal' buttons to animated block editor
- support for user accounts
- give areas and animated blocks direct access to their context, so you don't have to keep grabbing that.
- add a paint bucket tool
- make a global interval for animating all the blocks -- all of them. have it emit an event: 'tick'. have all the things listening to this go to the next frame of their animation when this fires. this might be more overhead than setting a setInterval. and it might not work, but it's worth a try. it fixes the problem of animations not lining up. do they need to???
- make default new layer transparent
- paths for movable blocks to move on top of
- don't animate blocks with only one layer. this also requires starting the animation when layers are added. and stopping it when all but one is removed.
- animations should line up so they happen at the same time
- Enhancement: remove 'save' button, make it an automatic update, make it use the same animated block so they all update at the same time. requires an animated block having more than one animated element.
- Fix: it'd be nice if each block in the color palette was stored and loaded somewhere so there's a new animated block didn't have to be created
- Fix: it'd be nice if the editor area didn't have a bunch of drawable surface, each with their own selected color
- make a button: generate example block
- ability to select a block in the main area or the main color palette in order to edit it
- should populate the main color palette with some cool custom blocks to start out with
- give AnimatedBlocks a clone method and use that instead of replicating their layers and stuff
- when you save a block it should update a block in the main color palette if there's a saved version of it there instead of creating a new one -- or saving should be different from exporting and should just save whatever you're working on (although this should be automatic probably, every 5 seconds if there's been changes)
- double click on a color to reveal similar colors, add a back button to go back to main color palette
- speech bubbles
- selected block follows cursor

### would be nice to have:
- don't load browser rejection script on every page load
- if a block is made entirely of the same color, convert it back to just a color when it's saved...?
- make the selected block dashed border move
- undo button with infinite undos
- add arbitrary colors to the main color palette and the object color palette
- rules for specifying how blocks interact
- global custom animation interval

### eventually:
- add EventEmitter2 library to make handling events easier. object could inherit from event emitters.
- maybe: add javascript-state-machine library. what could i use it for?

### backlog:
- BUG: when you leave the app for a while, the main canvas turns transparent and when you draw on it with a color it draws with an animated block instead (even though it doesn't show up on the canvas). can't replicate easily. not a known issue in google search.








