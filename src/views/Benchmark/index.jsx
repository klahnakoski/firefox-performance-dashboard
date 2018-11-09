import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';
import fetchData from '../../utils/fetchData';
import { CONFIG } from '../../config';
import Loading from '../../components/Loading';

const ChartJSWrapper = Loadable({
  loader: () => import(/* webpackChunkName: 'ChartJSWrapper' */ '../../components/ChartJSWrapper'),
  loading: Loading,
});

class Benchmark extends Component {
  static propTypes = {
    benchmark: PropTypes.string.isRequired,
    platform: PropTypes.string.isRequired,
    timeRange: PropTypes.number.isRequired,
  };

  state = {
    benchmarkData: {},
  };

  componentDidMount() {
    this.mounted = true;
    const { platform, benchmark, timeRange } = this.props;
    this.fetchData(platform, benchmark, timeRange);
  }

  componentDidUpdate(prevProps) {
    const { platform, benchmark, timeRange } = this.props;
    if (benchmark !== prevProps.benchmark
      || platform !== prevProps.platform
      || timeRange !== prevProps.timeRange
    ) {
      this.fetchData(platform, benchmark, timeRange);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  async fetchData(platform, benchmark, timeRange) {
    if (this.mounted) {
      this.setState({ benchmarkData: {} });
      this.setState({ benchmarkData: await fetchData(platform, benchmark, timeRange) });
    }
  }

  render() {
    // eslint-disable-next-line
    const { benchmark, platform } = this.props;
    const { benchmarkData } = this.state;
    const benchmarksToCompare = CONFIG.platforms[platform].benchmarks;

    return (
      benchmarksToCompare.map(benchmarkKey => (
        <div>
          <h2>
            <a id={benchmarkKey} href={`#${benchmarkKey}`}> # </a>
            {benchmarkKey}
          </h2>
          {benchmarkData.graphs && benchmarkData.graphs[`${benchmarkKey}-overview`] && (
            <ChartJSWrapper
              chartJsData={benchmarkData.graphs[`${benchmarkKey}-overview`].chartJsData}
              chartJsOptions={benchmarkData.graphs[`${benchmarkKey}-overview`].chartJsOptions}
            />
          )}
        </div>
      ))
    );
  }
}

export default Benchmark;
