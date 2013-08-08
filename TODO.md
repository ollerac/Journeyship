### working on now:




### what i *need* before launching:
- ✔ making copy layer button
  - ✔ inserting copied layer after the selected layer
- ✔ new layer button should create layers after the selected layer
- ✔ put new and copy buttons above the main color palette
  - ✔ moved them
  - ✔ new button should create a new palette element and show it in the editor
  - ✔ copy button should duplicate the selected custom palette element
    - ✔ don't show copy or delete button if a custom block isn't selected
  - ✔ delete button should delete the selected custom palette element
    - ✔ remove palette element from dom, from customAnimatedBlocks, and from main color palette map
    - ✔ auto-select the previous palette element, whatever it is
- ✔ added a default 'tree' custom block to the main color palette
- ✔ when selecting a block in the main color palette show it in the editor area unless it's a color -- then show nothing
- ✔ set select button to active when selecting blocks
  - ✔ when you click the select button when it's active make it not active and re-select the color palette style that was selected before
  - ✔ when you select a block, unselect the block in the main color palette and hide the editor area
    - ✔ only show edit and delete buttons if a selection is active
  - ✔ when selecting a color palette block, unselect the currently selected canvas block
    - ✔ hide th edit and delete buttons too
  - BUG: when you leave the app for a while, the main canvas turns transparent and when you draw on it with a color it draws with an animated block instead
  - when you click edit:
    - if the block is a color, convert it into an animated block, place it in the map, copy it, show the editor area, load it in
    - if it's already an animated block, get it from the map, copy it, show the editor area, load it in
    - make the edit button have an active state
    - when you select another block, disable active state of edit button
    - when you click 'save' save the block to the canvas
    - add an 'save to palette' button to the editor area, which copies the editor area's animated block into the main color palette
    - don't do this yet: ask if user wants to save changes to the current block if there are unsaved changes
- delete objects from main area
  - add ability to select canvas block
  - add trash can icon to button
  - when you delete a block, it's replaced by a regular color block that's still selected but not currently being edited
- !!! data persistence
  - save after doing stuff or after a certain amount of time? time i think
  - meteor? nodejs and mongodb?
- support multiple users (user accounts? url-based?)
  - url based and then user accounts
- ✔ export/save button should be in the top right of the editing area
- ✔ copy button working
- ✔ new block button working
- ✔ different button styling
- ✔ layers
  - ✔ new layer button, new layer function 
  - ✔ mirror objects that watch a map-like list property and update their canvas when an update method is called
  - ✔ add
  - ✔ remove
  - ✔ show which layer is selected with an icon or something
  - ✔ ability to select a layer 
  - ✔ link each layer to the preview animation
  - ✔ get the animate preview working
  - ✔ checkbox option: show previous layer on top of current layer with some transparency
  - ✔ checkbox option: indicate whether you're drawing on background or foreground
- ✔ save block
  - ✔ unique id (from underscore)
  - ✔ add to main color palette
- ✔ color palette
- ✔ be able to paint with custom boxes
- ✔ show selected color
- ✔ if there are too many custom blocks in the main color palette add new ones to a new column

### bugs
- sometimes buttons don't click. big problem.
- transparent blocks don't save or load correctly or place correctly (they just overlap things, they should replace)

### before launch
- test cross browser
- simple howto video
- add journeyship logo (with sail moving)

### after launch:
- new design
- organize code
- rewrite large parts of it using AngularJS

### would be *really* nice to have:
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
- ✔ a transparent color
- speech bubbles
- selected block follows cursor

### would be nice to have:
- if a block is made entirely of the same color, convert it back to just a color when it's saved...?
- make the selected block dashed border move
- undo button with infinite undos
- add arbitrary colors to the main color palette and the object color palette
- rules for specifying how blocks interact
- global custom animation interval

### eventually:
- add EventEmitter2 library to make handling events easier. object could inherit from event emitters.
- maybe: add javascript-state-machine library. what could i use it for?



### recently finishished:
- BUG: editing background/foreground not working
- BUG: transparent color stopped working
- BUG: switching layers and creating new layers when 'make top layer transparent' is checked
  - either uncheck it or make sure it's re-implemented after a new layer is selected
- BUG: deleting layers in different columns causes chaos. needs to cause a reflow of the columns and data. 
  - strongly consider not using columns. just use a bunch of divs floated to the left in a big box. colors and then white to black.
  - working on making color palette items not organized by columns
- BUG: clicking on buttons sometimes doesn't work. something to do with clicking on the very bottom of the button.
  - finish fixing the styling for this
- BUG: after creating a new layer the selected color gets reset
- copy button working
- new block button working
- ENHANCEMENT: added save button that doesn't make a new block when saving
- ENHANCEMENT: added new button style


### finished:
- BUG: fixed bug when you remove all layers (required splicing the drawablesurfaces property of the editArea)
- ENHANCEMENT: stopped animating the editor area's block
- fixed bug with transparency: needs to update the layers menu without breaking the main animated block
- 'new' button should be on the top of the main color palette
- removed draw on me layer
- ENHANCEMENT: adding a transparent block
  - only do adding it to a map and rendering -- no direct drawing...
  - requires having multiple shadow layers, one for each layer
    - one way: add all blocks, keep them all there, re-calculate z-index when you select a new block
    - another way: remove all blocks and replace then with new ones
    - i'm *really* tempted to rewrite this using angularjs
- ENHANCEMENT: made foreground and background layers work
- ENHANCEMENT: fix the transparency so that the selected layer has 50% transparency and the previous layer is behind it
- ENHANCEMENT: saved layers should be selected by default
- ENHANCEMENT: palettes should be responsible for multiple columns of colors and animated blocks and should be able to add new columns
- ENHANCEMENT: new layers should be selected by default
- removed font awesome
- BUG: no color is shown as selected at startup
- BUG: removing the selected layer doesn't update the editor's selected layer
- BUG: can select more than one color in one color palette as long as it's in different row. time to use a query selector engine like sizzle? or rye.js? or jquery? jquery it is.
- save block
  - unique id (from underscore)
  - add to main color palette- BUG: removing the first layer breaks the animation
- BUG: removing the first layer breaks the animation
- allow saving animated blocks to the main canvas color palette
- have animated blocks that are added to the main canvas start at the same index as the other blocks... how? when a new block is added just reset everyone to zero
- BUG: saving a block more than once adds more than one block
- lined up the animations of custom blocks added to the main color palette
- enhancement: remove margin from animated blocks in main color palette
- BUG: saving a new animation alters the patterns of existing saved animations
  - needed a _.cloneDeep() on the layers being passed to new AnimatedBlocks
- made an editorArea object to manage the editing area. it creates layers and has an animatedBlock and a drawableSurface as properties.
- do a test with a bunch of animating blocks so you can see what the performance will be like and so you can see how you should organize your code
- getting drawing on the constructorBlock to update the selected layer in the sidebar and the animation (it should just update the layer map thingie and that should broadcast the changes and then they can re-render and stuff)
- cleaned up code
  - animation objects are primary
    - layers (each a map)
    - selected layer
  - new: DrawableSurface object replaces original CanvasObject
- got updating the animated preview to work
- got the animation preview working
  - new properties for CanvasObject
    - layers
    - layerIndex
  - new functions for CanvasObject
    - addLayer
    - nextLayer
    - animate
- preview updates on changing the contructor block
- backup last version and commit this new version with cruft removed

