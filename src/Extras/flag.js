/* FlagIcon.js */

/* 
  A script to include FlagIcons in the app. Import once, 
  and can use the variable FlagIcon anywhere in the app via importing where needed. 
*/

// Import React: 
import * as React from 'react'

// Import the react-flag-icon-css module: 
import FlagIconFactory from 'react-flag-icon-css'

// Link React with the FlagIcon module: 
 const FlagIcon = FlagIconFactory(React)

// If you are not using css modules, link as follows: 
// const FlagIcon = FlagIconFactory(React, { useCssModules: false })
 
export default FlagIcon