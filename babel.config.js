module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: "defaults, IE 11, not dead",
        useBuiltIns: "entry",
        corejs: 3,
      },
    ],
  ],
  sourceType: "module",
};
