// Taken from github.com/isaacs/json-stringify-safe
export function serializer() {
  let stack: any[] = [];
  let keys: string[] = [];

  let cycleReplacer = function(key: string, value: any) {
    if (stack[0] === value) {
      return "[Circular ~]";
    }
    return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]";
  };

  return function(key: string, value: any) {
    if (stack.length > 0) {
      let thisPos = stack.indexOf(this);
      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
      if (~stack.indexOf(value)) {
        value = cycleReplacer.call(this, key, value);
      }
    }
    else {
      stack.push(value);
    }

    return value;
  };
}
