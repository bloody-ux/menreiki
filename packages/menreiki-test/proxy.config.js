module.exports = function(mock) {
  return [
    [
      '**/*.json', // include， glob rule
      (req, res, next) =>
        mock(req, res, { mockPath: '/mock', delay: 20 }, next),
      '**/*hot-update.json', // exclude
      // mock.remote(req, res, { target: 'http://openabmk-zth-2.gz00b.dev.alipay.net' }, next),
    ],
  ];
};
