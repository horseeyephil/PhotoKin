const immutableSplice = (arr=[], index, nextMember) =>{
  return [...arr.slice(0,index), nextMember, ...arr.slice(index+1)]
} 

export default immutableSplice

