const { useState, useEffect } = React;
const { createRoot } = ReactDOM;

function App() {
    return (
        <div>
            <h1>Linear Bar Chart Multicolor</h1><br/>
            <svg width="800" height="700"></svg> {/* Increased width of SVG */}
            <LinearBarChart />
        </div>
    );
}

function LinearBarChart() {
    useEffect(() => {
        // Create a linear scale for x-axis starting from 10
        const xScale = d3.scaleBand()
            .domain(d3.range(0, 10))  // Create a domain for 10 bars
            .range([30, 770])          // Output range increased to elongate the x-axis
            .padding(0.1);             // Add some padding between bars

        // Create a linear scale for y-axis
        const yScale = d3.scaleLinear()
            .domain([0, 100])          // Input domain
            .range([620, 30]);         // Output range (inverted to have 0 at the bottom and 100 at the top)

        // Sample data
        const data = [10, 90, 30, 80, 50, 40, 70, 20, 100, 60];

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
            .tickValues(d3.range(0, 10)) // Set tick values to match the bar indices
            .tickFormat((d, i) => (i + 1) * 10); // Format ticks to show values starting from 10

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
            .text(d => d); // Display the height value of the bar
    }, []); // Empty dependency array to run only once on mount

    return null; // This component does not render anything itself
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
