### general
- backward compatability is hard, would be a good thing to get better at

### working on now:
- testing in ie10, loading isn't working


### launch date: monday, september 9th
- make a largish project locally, test it in IE, Firefox, Safari
- deploy to prod, test old projects with the new setup
- add more starting blocks, like trees and people and dogs and flowing water and boats
- add footer
  - creative commons license info 
  - github link
  - social share buttons
- guided javascript walkthrough: use hopscotch
  - button: 'Tutorial' < 'click me!'
  - first of all, welcome! journeyship is a small app you can use to create animations

### after launch
- invite people

### after launch
- minify and concatenate js (part of grunt)
- start using a css preprocessor (part of grunt)
- use cache breaker (part of yeoman or grunt or bower?)
- make a t-shirt (http://www.customink.com/)

### next cycle
- found bug: select a block on the main canvas and click 'transfer to palette' and it will update a version of the block that was already transferred instead of making a new one
- undo!!!
  - after every change make a copy of the major areas and put them in a queue, when user presses undo pop the last thing put in the que and load it
    - make general savedata function for this and for the general save
- ability to convert animation to video and download or embed
- selected block follows mouse on canvas
- 'what is this?' page
  - github link
  - about journeyship video
- need better test animations to see if things are working going forward
- easy: make function for animated blocks called 'replacelayers' that accepts layers as arguments and replaces the current ones. use this in the '#save-block' area instead of what's there. and then use regeneratePrerenderedLayers inside this new function
- prerendered blocks
  - currently i'm regenerating the prerendered canvas blocks every time a layer is added or changed or updated. i should just regenerate the ones that need it
    - onchange: use _.isEqual to compare each layer and only regenerate the layer that needs to be regenerated, function: addPrerenderedLayerFor(layerIndex)
    - on add: make a function addPrerenderedLayerAt(index)
    - on delete: make a function deletePrerenderedLayerAt(index)
  - currently each animated block had its own prerendered blocks. this isn't necessary if they have the same id as a block that was already created. blocks should have the same id if they weren't edited separately by using the 'select' button. this way they can all be updated at the same time. this will also save a lot of memory
- movement blocks
  - button: 'reset position' for blocks that have been moved
- checkbox: only show the selected layer
- don't use selected block to carry info about movement type, just use animated block
- separate main js file into modules and concatenate and minify on deploy
- show a list of recently created journeyships
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








