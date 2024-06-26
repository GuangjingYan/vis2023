import * as d3 from "d3";

const colormap = (cluster) => {

  const color = ["#8dd3c7","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"];

  return color[parseInt(cluster)];
}

export default colormap;