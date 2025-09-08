const pptxgen = require("pptxgenjs");
const fs = require("fs");

class EnhancedScientificPresentationGenerator {
    constructor(themeData) {
        this.pptx = new pptxgen();
        this.themeData = themeData;
        this.colors = {
            primary: "1F497D",    // Dark Blue
            secondary: "4F81BD",  // Lighter Blue
            accent: "C0504D",      // Red
            accent3: "9BBB59",    // Green
            accent4: "8064A2",    // Purple
            accent5: "4BACC6",    // Cyan
            accent6: "F79646",    // Orange
            text_light: "FFFFFF", // White
            text_dark: "000000",     // Black
            background_light: "FFFFFF",
            background_dark: "1F497D"
        };
        this.fonts = {
            body: "Calibri",
            title: "Calibri (Headings)"
        };
        this.pptx.layout = "LAYOUT_16x9";
        this.defineMasterSlide();
    }

    defineMasterSlide() {
        this.pptx.defineSlideMaster({
            title: "MASTER_SLIDE",
            background: { color: "FFFFFF" },
            objects: [
                {
                    "rect": { x: 0, y: "90%", w: "100%", h: "10%", fill: { color: this.colors.primary } }
                },
                {
                    "text": {
                        text: "Scientific Conference on Computational Biology",
                        options: {
                            x: 0, y: "90%", w: "100%", h: "10%", align: "center", vertical: "middle",
                            fontFace: this.fonts.body, fontSize: 12, color: this.colors.text_light
                        }
                    }
                }
            ],
            slideNumber: {
                x: "90%", y: "90%", w: "9%", h: "10%", align: "right",
                fontFace: this.fonts.body, fontSize: 12, color: this.colors.text_light
            }
        });
    }

    generate() {
        this.addTitleSlide();
        this.addSectionHeaderSlide("INTRODUCTION");
        this.addContentSlide_TextWithHeader("BACKGROUND", "The Genesis of Our Research", [
            "This study originates from the need to understand complex biological systems.",
            "Previous models lacked the predictive power for real-world applications.",
            "Our approach integrates multi-omics data for a holistic view."
        ]);
        this.addContentSlide_TwoColumnWithImage("METHODOLOGY", [
            "Utilized a novel machine learning algorithm.",
            "Processed over 10TB of genomic data.",
            "Validated results using in-vitro experiments."
        ], "assets-images/laboratory.jpg"); // Assuming a relevant image
        this.addChartSlide("RESULTS", "Key Performance Metrics", [
            { name: "Model A", value: 85 },
            { name: "Model B", value: 92 },
            { name: "Model C", value: 78 }
        ]);
        this.addConclusionSlide("CONCLUSION", [
            "Our model significantly outperforms existing methods.",
            "The findings open new avenues for therapeutic intervention.",
            "Future work will focus on clinical trial simulations."
        ]);
        this.addQASlide("QUESTIONS?", "j.doe@example.com | www.research-project.com");

        this.pptx.writeFile({ fileName: "c:\\Users\\jayve\\projects\\Slidy-presto\\final_scientific_presentation.pptx" })
            .then(fileName => console.log(`Created presentation: ${fileName}`))
            .catch(err => console.error(err));
    }

    addTitleSlide() {
        let slide = this.pptx.addSlide({ masterName: "MASTER_SLIDE" });
        slide.background = { color: this.colors.background_dark };

        slide.addText("Advanced Research in Computational Biology", {
            x: 0, y: "35%", w: "100%", align: "center",
            fontFace: this.fonts.title, fontSize: 44, color: this.colors.text_light, bold: true
        });

        slide.addText("A Deep Dive into Modern Techniques", {
            x: 0, y: "50%", w: "100%", align: "center",
            fontFace: this.fonts.body, fontSize: 28, color: this.colors.text_light
        });
         slide.addShape(this.pptx.shapes.LINE, {
            x: "25%", y: "58%", w: "50%", h: 0, line: { color: this.colors.secondary, width: 2 }
        });
    }

    addSectionHeaderSlide(title) {
        let slide = this.pptx.addSlide({ masterName: "MASTER_SLIDE" });
        slide.background = { color: this.colors.primary };
        slide.addShape(this.pptx.shapes.LINE, {
            x: "25%", y: "45%", w: "50%", h: 0, line: { color: this.colors.secondary, width: 2 }
        });
        slide.addText(title, {
            x: 0, y: 0, w: "100%", h: "100%",
            align: "center", vertical: "middle",
            fontFace: this.fonts.title, fontSize: 54, color: this.colors.text_light, bold: true
        });
    }

    addContentSlide_TextWithHeader(headerTitle, bodyTitle, bulletPoints) {
        let slide = this.pptx.addSlide({ masterName: "MASTER_SLIDE" });
        slide.background = { color: this.colors.text_light };

        // Header
        slide.addShape(this.pptx.shapes.RECTANGLE, {
            x: 0, y: 0, w: "100%", h: "10%", fill: { color: this.colors.primary }
        });
        slide.addText(headerTitle, {
            x: "2%", y: 0, w: "96%", h: "10%",
            align: "left", vertical: "middle",
            fontFace: this.fonts.title, fontSize: 24, color: this.colors.text_light, bold: true
        });

        // Accent Line
        slide.addShape(this.pptx.shapes.RECTANGLE, {
            x: "2%", y: "15%", w: "0.5%", h: "8%", fill: { color: this.colors.accent }
        });

        // Body
        slide.addText(bodyTitle, {
            x: "3%", y: "15%", w: "94%", h: "10%",
            fontFace: this.fonts.title, fontSize: 32, color: this.colors.primary, bold: true
        });

        slide.addText(bulletPoints.join("\n"), {
            x: "3%", y: "30%", w: "94%", h: "65%",
            fontFace: this.fonts.body, fontSize: 24, color: this.colors.text_dark,
            bullet: true
        });
    }

    addContentSlide_TwoColumnWithImage(headerTitle, bulletPoints, imagePath) {
        let slide = this.pptx.addSlide({ masterName: "MASTER_SLIDE" });
        slide.background = { color: this.colors.text_light };

        // Header
        slide.addShape(this.pptx.shapes.RECTANGLE, {
            x: 0, y: 0, w: "100%", h: "10%", fill: { color: this.colors.primary }
        });
        slide.addText(headerTitle, {
            x: "2%", y: 0, w: "96%", h: "10%",
            align: "left", vertical: "middle",
            fontFace: this.fonts.title, fontSize: 24, color: this.colors.text_light, bold: true
        });

        // Left Column (Text)
        slide.addText(bulletPoints.join("\n"), {
            x: "2%", y: "15%", w: "45%", h: "80%",
            fontFace: this.fonts.body, fontSize: 22, color: this.colors.text_dark,
            bullet: true
        });

        // Right Column (Image)
        slide.addImage({
            path: imagePath,
            x: "50%", y: "15%", w: "48%", h: "80%"
        });
    }

     addChartSlide(headerTitle, chartTitle, chartData) {
        let slide = this.pptx.addSlide({ masterName: "MASTER_SLIDE" });
        slide.background = { color: this.colors.text_light };

        // Header
        slide.addShape(this.pptx.shapes.RECTANGLE, {
            x: 0, y: 0, w: "100%", h: "10%", fill: { color: this.colors.primary }
        });
        slide.addText(headerTitle, {
            x: "2%", y: 0, w: "96%", h: "10%",
            align: "left", vertical: "middle",
            fontFace: this.fonts.title, fontSize: 24, color: this.colors.text_light, bold: true
        });

        // Chart Title
        slide.addText(chartTitle, {
            x: 0, y: "12%", w: "100%", align: "center",
            fontFace: this.fonts.title, fontSize: 28, color: this.colors.primary
        });

        const labels = chartData.map(item => item.name);
        const values = chartData.map(item => item.value);
        const data = [{
            name: "Key Performance Metrics",
            labels: labels,
            values: values
        }];

        slide.addChart(this.pptx.charts.BAR, data, {
            x: 1, y: 2, w: 8, h: 4,
            barDir: 'col',
            showValue: true,
            dataLabelFontSize: 14,
            catAxisLabelFontSize: 12,
            valAxisLabelFontSize: 12,
            showCatAxis: true,
            showValAxis: true,
            valAxisMaxVal: 100,
            valAxisMajorUnit: 20,
            valGridLine: { style: 'dash', color: 'D3D3D3' }
        });
    }


    addConclusionSlide(headerTitle, bulletPoints) {
        let slide = this.pptx.addSlide({ masterName: "MASTER_SLIDE" });
        slide.background = { color: this.colors.text_light };

        // Header
        slide.addShape(this.pptx.shapes.RECTANGLE, {
            x: 0, y: 0, w: "100%", h: "10%", fill: { color: this.colors.primary }
        });
        slide.addText(headerTitle, {
            x: "2%", y: 0, w: "96%", h: "10%",
            align: "left", vertical: "middle",
            fontFace: this.fonts.title, fontSize: 24, color: this.colors.text_light, bold: true
        });

        // Body
        slide.addText(bulletPoints.join("\n"), {
            x: "5%", y: "20%", w: "90%", h: "75%",
            fontFace: this.fonts.body, fontSize: 28, color: this.colors.text_dark,
            bullet: { code: "2713", style: { color: "5A9A4D" } } // Green checkmark
        });
    }

    addQASlide(title, contactInfo) {
        let slide = this.pptx.addSlide({ masterName: "MASTER_SLIDE" });
        slide.background = { color: this.colors.primary };

        slide.addText(title, {
            x: 0, y: "30%", w: "100%",
            align: "center",
            fontFace: this.fonts.title, fontSize: 60, color: this.colors.text_light, bold: true
        });

        slide.addText(contactInfo, {
            x: 0, y: "60%", w: "100%",
            align: "center",
            fontFace: this.fonts.body, fontSize: 24, color: this.colors.text_light
        });
    }
}

// Main execution
try {
    // In a real scenario, you might load this from a JSON file
    const themeData = {
        name: "Scientific Conference Theme"
    };
    const generator = new EnhancedScientificPresentationGenerator(themeData);
    generator.generate();
} catch (error) {
    console.error("Error generating presentation:", error);
}