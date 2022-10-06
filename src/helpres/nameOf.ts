/* eslint-disable no-useless-escape */
/**
 * Usage
 * nameOf(() => myVariable)             // myVariable
 * nameOf(() => myVariable.name)        // myVariable.name
 * nameOf(() => myVariable.name.length) // myVariable.name.length
 * nameOf(() => myVariable.name[10])    // myVariable.name[10]
 * nameOf(() => MySuperClass)           // MySuperClass
 *
 * @param f
 * @return string
 */
const nameOf = (f: any): string => (f).toString()
  .replace(/[ |\(\)=>]/g,'')
  .replace('function{return', '')
  .replace('}', '')
  .replace(';', '');

export default nameOf;
