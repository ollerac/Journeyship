### working on now:


### what i *need* before launching:
- delete objects from main area
- delete objects from main color palette
- export/save button should be in the top right of the editing area
- what to do when saving more than 2 columns of custom blocks. options:
  - make it scrollable <-- yes
  - make it paged
  - expand the width of the main container
- !!! data persistence
  - save after doing stuff or after a certain amount of time? time i think
- support multiple users (user accounts? url-based?)
  - url based and then user accounts
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

### before launch?
- simple howto video
- add journeyship logo (with sail moving)

### after launch:
- new design
- organize code

### would be *really* nice to have:
- ability to select a block in the main area or the main color palette in order to edit it
- should populate the main color palette with some cool custom blocks to start out with
- give AnimatedBlocks a clone method and use that instead of replicating their layers and stuff
- when you save a block it should update a block in the main color palette if there's a saved version of it there instead of creating a new one -- or saving should be different from exporting and should just save whatever you're working on (although this should be automatic probably, every 5 seconds if there's been changes)
- double click on a color to reveal similar colors, add a back button to go back to main color palette
- ✔ a transparent color
- speech bubbles
- selected block follows cursor

### would be nice to have:
- undo button with infinite undos
- add arbitrary colors to the main color palette and the object color palette
- paths for movable blocks to move on top of
- rules for specifying how blocks interact
- global custom animation interval

### eventually:
- add EventEmitter2 library to make handling events easier. object could inherit from event emitters.
- maybe: add javascript-state-machine library. what could i use it for?



### recently finishished:
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

