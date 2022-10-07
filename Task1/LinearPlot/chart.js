async function buildPlot() {
    console.log("Hello world");
    const data = await d3.json("my_weather_data.json");
    //console.table(data);
    const dateParser = d3.timeParse("%Y-%m-%d");
    const yAccessor = (d) => d.temperatureMin;
    const yAccessorHigh = (d) => d.temperatureHigh;
    const xAccessor = (d) => dateParser(d.date);
    // Функции для инкапсуляции доступа к колонкам набора данных

    var dimension = {
        width: window.innerWidth*0.5,
        height: 400,
        margin: {
            top: 15,
            left: 15,
            bottom: 15,
            right: 15
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg")
    svg.attr("height",dimension.height);
    svg.attr("width",dimension.width);
    const bounded = svg.append("g");
    bounded.style("transform",`translate(${dimension.margin.left}px, ${dimension.margin.top})`);

    const yScaler = d3.scaleLinear()
        .domain(d3.extent(data,yAccessor))
        .range([dimension.boundedHeight,0]);

    const xScaler = d3.scaleTime()
        .domain(d3.extent(data,xAccessor))
        .range([0,dimension.boundedWidth]);

    const yScalerHigh = d3.scaleLinear()
        .domain(d3.extent(data,yAccessorHigh))
        .range([dimension.boundedHeight,0]);


    var lineGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScaler(yAccessor(d)));

    var lineGeneratorHigh = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScalerHigh(yAccessorHigh(d)));

    bounded.append("path")
        .attr("d",lineGenerator(data))
        .attr("fill","none")
        .attr("stroke","blue")

    bounded.append("path")
        .attr("d",lineGeneratorHigh(data))
        .attr("fill","none")
        .attr("stroke","red")

    const yAxisGenerator = d3.axisLeft(yScaler);
    bounded.append("g")
        .call(yAxisGenerator)
        .style("transform", `translate(${dimension.boundedWidth + 20}px)`) ;

    const xAxisGenerator = d3.axisBottom(xScaler);
    bounded.append("g")
        .call(xAxisGenerator.tickFormat(d3.timeFormat("%m-%d")))
        .style("transform", `translateY(${dimension.boundedHeight}px)`);


}

buildPlot();