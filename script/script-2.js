/* Part 2 shows how to parse */

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

/* Acquire and parse data */
d3.csv('data/world_bank_2012.csv', parse, dataLoaded);

function dataLoaded(err,rows){
    console.log(rows);
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