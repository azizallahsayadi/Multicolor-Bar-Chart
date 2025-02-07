const { useState, useEffect } = React;
const { createRoot } = ReactDOM;

function App() {
    return (
        <div>
            <h1>Linear Bar Chart Multicolor</h1><br/>
            <div id="data"></div>
            <LinearBarChart />
        </div>
    );
}

function LinearBarChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const url = "https://disease.sh/v3/covid-19/countries"; 
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const jsonData = await response.json();
            // Extracting a specific data point for the chart, e.g., cases
            const casesData = jsonData.map(country => country.cases).slice(40, 70); // Get first 10 countries
            console.log(jsonData.length);
            setData(casesData);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (data.length === 0) return; // Don't render if there's no data
        console.log(data.length);

        // Create a linear scale for x-axis starting from 10
        const xScale = d3.scaleBand()
            .domain(d3.range(0, data.length))  // Create a domain for the number of bars
            .range([30, data.length*20])                   // Output range increased to elongate the x-axis
            .padding(0.1);                      // Add some padding between bars

        // Create a linear scale for y-axis
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data)])         // Input domain based on max data value
            .range([620, 30]);                  // Output range (inverted to have 0 at the bottom and max at the top)

        // Define an array of colors
        const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet", "pink", "cyan", "magenta"];

        // Select the SVG
        const svg = d3.select("svg");

        // Clear previous content
        svg.selectAll("*").remove();

        // Create bars
        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d, i) => xScale(i))  // Use the scale for x position
            .attr("y", d => yScale(d))       // Use the yScale for y position
            .attr("width", xScale.bandwidth()) // Width of each bar
            .attr("height", d => 620 - yScale(d)) // Height of each bar
            .attr("fill", (d, i) => colors[i % colors.length]); // Assign color based on index

        // Create x-axis
        const xAxis = d3.axisBottom(xScale)
            .tickValues(d3.range(0, data.length)) // Set tick values to match the bar indices
            .tickFormat((d, i) => (i + 1)); // Format ticks to show values starting from 1

        // Create y-axis
        const yAxis = d3.axisLeft(yScale);

        // Append x-axis to the SVG
        svg.append("g")
            .attr("transform", "translate(0, 620)") // Move the axis to the bottom
            .call(xAxis);

        // Append y-axis to the SVG
        svg.append("g")
            .attr("transform", "translate(30, 0)") // Move the axis to the left
            .call(yAxis);

        // Add labels for each bar
        svg.selectAll("text.bar-label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "bar-label")
            .attr("x", (d, i) => xScale(i) + xScale.bandwidth() / 2) // Center the label
            .attr("y", d => yScale(d) - 5) // Position inside the bar (adjust as needed)
            .attr("text-anchor", "middle") // Center the text
            .attr("fill", "white") // Set the text color to white for better contrast
            //.text(d => d); // Display the height value of the bar
    }, [data]); // Run this effect whenever the data changes

    return (
        <svg width="800" height="700"></svg> // Render the SVG element
    );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
