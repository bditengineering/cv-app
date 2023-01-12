import React from "react";
import { Document, Page, Text, StyleSheet, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  body: {
    width: "100%",
  },
  section: { margin: 20 },
  header: {
    backgroundColor: "#e5e7eb",
    fontWeight: "bold",
    padding: "20",
    border: "1px solid gray",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
  },
  summary: {
    border: "1px solid gray",
    padding: "15",
  },
  leftColumn: {
    border: "1px solid gray",
    display: "flex",
    width: "30%",
    padding: "15",
  },
  rightColumn: {
    border: "1px solid gray",
    display: "flex",
    padding: "15",
    width: "70%",
  },
  name: {
    textAlign: "center",
    fontWeight: "bold",
    padding: "30",
  },
});

const GeneratedPDF = (cv: any) => {
  return (
    <Document>
      <Page size="A4">
        <View style={styles.body}>
          <View style={styles.name}>
            <Text>{cv.cv.first_name + " " + cv.cv.last_name}</Text>
          </View>
          <View style={styles.section}>
            <View style={styles.header}>
              <Text>Summary of Qualification</Text>
            </View>
            <View style={styles.summary}>
              <Text>{cv.cv.summary}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.header}>
              <Text>Technical Skills</Text>
            </View>
            {cv.cv.programming_languages &&
              cv.cv.programming_languages.length > 0 && (
                <View style={styles.row}>
                  <View style={styles.leftColumn}>
                    <Text>Programming Languages</Text>
                  </View>
                  <View style={styles.rightColumn}>
                    {cv.cv.programming_languages.map((item: any) => (
                      <Text key={item} render={() => `- ${item}`} />
                    ))}
                  </View>
                </View>
              )}
            {cv.cv.libs_and_frameworks &&
              cv.cv.libs_and_frameworks.length > 0 && (
                <View style={styles.row}>
                  <View style={styles.leftColumn}>
                    <Text>Libs & Frameworks</Text>
                  </View>
                  <View style={styles.rightColumn}>
                    {cv.cv.libs_and_frameworks.map((item: any) => (
                      <Text key={item} render={() => `- ${item}`} />
                    ))}
                  </View>
                </View>
              )}
            {cv.cv.big_data && cv.cv.big_data.length > 0 && (
              <View style={styles.row}>
                <View style={styles.leftColumn}>
                  <Text>Big data</Text>
                </View>
                <View style={styles.rightColumn}>
                  {cv.cv.big_data.map((item: any) => (
                    <Text key={item} render={() => `- ${item}`} />
                  ))}
                </View>
              </View>
            )}
            {cv.cv.databases && cv.cv.databases.length > 0 && (
              <View style={styles.row}>
                <View style={styles.leftColumn}>
                  <Text>Databases</Text>
                </View>
                <View style={styles.rightColumn}>
                  {cv.cv.databases.map((item: any) => (
                    <Text key={item} render={() => `- ${item}`} />
                  ))}
                </View>
              </View>
            )}
            {cv.cv.devops && cv.cv.devops.length > 0 && (
              <View style={styles.row}>
                <View style={styles.leftColumn}>
                  <Text>Dev Ops</Text>
                </View>
                <View style={styles.rightColumn}>
                  {cv.cv.devops.map((item: any) => (
                    <Text key={item} render={() => `- ${item}`} />
                  ))}
                </View>
              </View>
            )}
          </View>
          <View style={styles.section}>
            <View style={styles.header}>
              <Text>Education</Text>
            </View>
            <View style={styles.row}>
              <View style={styles.leftColumn}>
                <Text>University degree</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text>{cv.cv.university}</Text>
                <Text>{cv.cv.degree}</Text>
                <View style={styles.row}>
                  <Text>{cv.cv.university_start} - </Text>
                  <Text>{cv.cv.university_end}</Text>
                </View>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.leftColumn}>
                <Text>Level Of English</Text>
                <Text>Spoken</Text>
                <Text>Written</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text> </Text>
                <Text>{cv.cv.english_spoken}</Text>
                <Text>{cv.cv.english_written}</Text>
              </View>
            </View>
            {cv.cv.certifications && cv.cv.certifications.length > 0 && (
              <View style={styles.row}>
                <View style={styles.leftColumn}>
                  <Text>Certifications</Text>
                </View>
                <View style={styles.rightColumn}>
                  {cv.cv.certifications.map((item: any) => (
                    <Text key={item} render={() => `- ${item}`} />
                  ))}
                </View>
              </View>
            )}
          </View>
          {cv.cv.personal_qualities && cv.cv.personal_qualities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.header}>Additional Information</Text>
              <View style={styles.row}>
                <View style={styles.leftColumn}>
                  <Text>Personal qualities</Text>
                </View>
                <View style={styles.rightColumn}>
                  {cv.cv.personal_qualities.map((item: any) => (
                    <Text key={item} render={() => `- ${item}`} />
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default GeneratedPDF;
