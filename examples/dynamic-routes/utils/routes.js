export const loadRoute = (callBack, store) => {
  return module => callBack(null, module.default(store));
};

export const loadMultipleRoutes = (callBack, store) => {
  return (modules) => {
    callBack(null, parseModules(modules, store));
  };
};

export const parseModules = (modules, store) => {
  return modules.map(module => module.default(store));
};