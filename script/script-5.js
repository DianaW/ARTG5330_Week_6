/* Part 5 fine-tuning axes */


/*Start by setting up the canvas */
var margin = {t:50,r:50,b:50,l:50};
var width = $('.canvas').width() - margin.r - margin.l,
    height = $('.canvas').height() - margin.t - margin.b;

var canvas = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

/* Set up scales for x and y axes */
var scaleX = d3.scale.log().range([0,width]),
    scaleY = d3.scale.linear().range([height,0]);

/* Set up axis generator */
var axisX = d3.svg.axis()
    .orient('bottom')
    .tickValues([1045,4125,12746,40000])
    .tickSize(-height,0)
    .scale(scaleX);
var axisY = d3.svg.axis()
    .orient('left')
    .tickSize(-width,0)
    .scale(scaleY);


/* Acquire and parse data */
console.log("Start loading data");
d3.csv('data/world_bank_2012.csv', parse, dataLoaded);

function dataLoaded(err,rows){
    console.log("Data loaded");

    var minX = d3.min(rows, function(d){ return d.gdpPerCap; }),
        maxX = d3.max(rows, function(d){ return d.gdpPerCap; });
    scaleX.domain([minX, maxX]);
    scaleY.domain([0,100]);

    /* You can draw the axes now or later in the draw function */
    canvas.append('g')
        .attr('class','axis x')
        .attr('transform','translate(0,'+height+')')
        .call(axisX);
    canvas.append('g')
        .attr('class','axis y')
        .call(axisY);

    draw(rows);
}

function draw(rows){
    console.log("Start drawing");

    /*IMPORTANT! Using .selectAll(), .data(), and .enter() to automatically generate DOM elements for data elements */
    var nodes = canvas.selectAll('.node')
        .data(rows)
        .enter()
        .append('circle')
        .attr('class','node');

    nodes
        .filter(function(d){
            return d.gdpPerCap && d.urbanPop;
        })
        .attr('cx', function(d){
            return scaleX(d.gdpPerCap);
        })
        .attr('cy', function(d){
            return scaleY(d.urbanPop);
        })
        .attr('r',4)
        .attr('id',function(d){
            return d.countryCode;
        });
}

function parse(row){
    //@param row is each unparsed row from the dataset
    return {
        gdpPerCap: row['GDP per capita, PPP (constant 2011 international $)']=='..'?undefined:+row['GDP per capita, PPP (constant 2011 international $)'],
        primComplete: row['Primary completion rate, total (% of relevant age group)']=='..'?undefined:+row['Primary completion rate, total (% of relevant age group)'],
        urbanPop: row['Urban population (% of total)']=='..'?undefined:+row['Urban population (% of total)'],
        country: row['Country Name'],
        countryCode: row['Country Code']
    };
}