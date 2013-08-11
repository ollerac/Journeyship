### working on now:
- ✔ set up a static file server using express
- ✔ got ids working in url
- ✔ working on ajax endpoints
- ✔ refreshing database data
- ✔ making ajax endpoints consume json and output it
- ✔ saving data
  - ✔ layers to save
    - ✔ save layers of editor area's animated block
    - ✔ save custom blocks in main color palette
    - ✔ save bg and fg layer of main canvas
  - ✔ convert animated blocks into their layers
- ✔ add loading functions to each area that needs to save things and set it up so that they don't get started until they check to see what the loaded object has. that means giving each of them an init() function and calling it inside the response to the ajax call. so it will be
  - ✔ editorArea.setup(data.animatedBlock.layers)
  - ✔ mainArea.setup({firstLayer: data.main.firstLayer, secondLayer: data.main.secondLayer})
  - ✔ mainColorPalette.setup(data.main.palette)
- make a loading indicator overlay that displays until all of the data is loaded in
- ✔ make 404 page
- urls
  - ✔ load journeyship.com
    - ✔ get next story id
      - ✔ save a story with this id
        - ✔ redirect to this id
  - load id (url/id[/secondId])
    get('story-' + id) or get('story-' + id + '-' secondId)
    - exists
      load page
      - get the ids from the url with History.getState
      - ajax load ('story-' + id) or ('story-' + id + '-' secondId)
    - else
      load 404
  - on page
    - click 'save'
      - set('story-' + id + '-' window.location.pathname(after first slashes), if none start at 1)
      - History.pushState(null, null, "id/secondId");




### what i *need* before launching:
- HERE WE GO... Adding node.js first
- !!! data persistence
  - save after doing stuff or after a certain amount of time? time i think
  - meteor? nodejs and mongodb?
- support multiple users (user accounts? url-based?)
  - url based and then user accounts
- get the urls working with earlier versions of IE


### bugs
- BUG: when you delete the first layer is selects the last layer... what's up with that?
- BUG: sometimes buttons don't click. big problem. What the heck is going on with this?
- BUG: when you leave the app for a while, the main canvas turns transparent and when you draw on it with a color it draws with an animated block instead (even though it doesn't show up on the canvas). maybe google this.

### before launch
- test cross browser... ugh.
- simple howto video
- add journeyship logo (with sail moving)

### after launch:
- new design
- organize code
- rewrite large parts of it using AngularJS

### would be *really* nice to have:
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
- if a block is made entirely of the same color, convert it back to just a color when it's saved...?
- make the selected block dashed border move
- undo button with infinite undos
- add arbitrary colors to the main color palette and the object color palette
- rules for specifying how blocks interact
- global custom animation interval

### eventually:
- add EventEmitter2 library to make handling events easier. object could inherit from event emitters.
- maybe: add javascript-state-machine library. what could i use it for?

