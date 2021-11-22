# Indy Test

Test fullfilled by William CHAZOT (Nonudian).
I've used TypeScript & Node.js environment.

For the structure, as you can see in the `src` folder:
- criteria/
    * ***.criterion.ts**: *each file per criterion (age, date, weather and more...), contains a mapping with specific property names, and the function that allow property checking*
- **index.ts**: *main file, with the main required function*
- **types.ts**: *type file, that enumerates all used types*

For tests, I've made two things :
- add a new one to check an error occurs when weather criteria is not at 'clear' (when its cloudy for example)
- modify the second original test, that waits for 'clear' weather while it's fully dependent to the API, so it could change at any time (for me that was 'cloud'y all the time).