### working on now:


### what i *need* before launching:
- layers
  - ✔ new layer button, new layer function 
  - ✔ mirror objects that watch a map-like list property and update their canvas when an update method is called
  - ✔ add
  - ✔ remove
  - ✔ show which layer is selected with an icon or something
  - ✔ ability to select a layer 
  - checkbox option: show previous layer on top of current layer with some transparency
  - ✔ link each layer to the preview animation
  - ✔ get the animate preview working
  - checkbox option: indicate a layer is a background or foreground object... necessary?
- ✔ save block
  - ✔ unique id (from underscore)
  - ✔ add to main color palette
- new block button working
- ✔ color palette
- ✔ be able to paint with custom boxes
- ✔ show selected color
- delete objects from main area
- delete objects from main color palette
- !!! data persistence
- ✔ if there are too many custom blocks in the main color palette add new ones to a new column

### would be *really* nice to have:
- double click on a color to reveal similar colors, add a back button to go back to main color palette
- a transparent color
  - is this possible? would require redrawing transparent blocks the same as the underlying canvas. possible.
- add journeyship logo (with sail moving)
- speech bubbles
- select a block in the main area or the main color palette in order to edit it
- selected block follows cursor

### would be nice to have:
- add arbitrary colors to the main color palette and the object color palette
- paths for movable blocks to move on top of
- rules for specifying how blocks interact
- global custom animation interval

### eventually:
- clean up rendering
  - there's currently two ways that blocks get rendered, by drawing and by updating a map and then rendering the layer. make sure these don't both get called on the same thing.
- add EventEmitter2 library to make handling events easier. object could inherit from event emitters.
- maybe: add javascript-state-machine library. what could i use it for?



### recently finishished:
- ENHANCEMENT: saved layers should be selected by default
- ENHANCEMENT: palettes should be responsible for multiple columns of colors and animated blocks and should be able to add new columns
- ENHANCEMENT: new layers should be selected by default
- removed font awesome
- BUG: no color is shown as selected at startup
- BUG: removing the selected layer doesn't update the editor's selected layer


### finished:
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

