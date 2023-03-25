# Portal-Experience
This experience its based on https://threejs-journey.com/ chapter 6 Portal Scene.
- Uses my own model and texture.
- Has an extended portal fragment shader to make an initial animation for opening the portal.
- Has an extra particles with vertex and fragment shader to simulate a very basic kabush effect on the initial portal animation.
- You can tweak those shader values and have some fun, and even try to get a better result qhit this sand box. (but you need to be in debug mode, use #debug after the url and refresh)
- You can open / close the portal by clicking them
- Added a consistent bloow effect to all animations (open / wave / close)

Pourpose of this? have fun and learn a bit more.

https://user-images.githubusercontent.com/15678544/227725970-0b06a3d0-c550-4801-a8b8-2bcf5d94d9d3.mp4


This project uses vite as a build tool (https://vitejs.dev/guide/)... Im not an expert in build tools, before i started the three.js-journey i was using a windows apache server with xampp (yes im a bit prehistoric, its the age i think xd).

You need run <code>npm install</code> once to get all dependencies.

And then you can use <code>npm run dev</code> to start the local test server.

Live example : https://devildrey33.es/Ejemplos/Three.js-Journey/39-Adding-details-to-the-scene/
