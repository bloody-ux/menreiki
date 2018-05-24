module.exports = function(mock) {
  return [
    [
      '**/*.json', // include， glob rule
      (req, res) =>
        mock(req, res, { mockPath: '/mock', delay: 20 }),
      '**/*hot-update.json', // exclude
    ],
  ];
};
