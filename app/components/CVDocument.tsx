"use client";

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Link } from '@react-pdf/renderer';
import { CVData, isSkipped } from '../types';
// Helper imported from types

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#333',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  personalDetailsTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    color: '#000',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 2,
  },
  name: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  contactInfo: {
    flexDirection: 'column',
    gap: 4,
    fontSize: 10,
    color: '#444',
  },
  contactItem: {
    flexDirection: 'row',
  },
  contactLabel: {
    fontFamily: 'Helvetica-Bold',
    width: 60,
    color: '#222',
  },
  contactValue: {
    flex: 1,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    color: '#000',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 2,
  },
  itemBlock: {
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  title: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    color: '#222',
  },
  date: {
    fontSize: 10,
    color: '#666',
  },
  description: {
    marginTop: 2,
    fontSize: 11,
    color: '#444',
  },
  certifications: {
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 2,
  },
  link: {
    color: '#0ea5e9',
    textDecoration: 'none',
    fontSize: 10,
    marginTop: 2,
  }
});

interface CVDocumentProps {
  cvData: CVData;
}

const CVDocument: React.FC<CVDocumentProps> = ({ cvData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.name}>{cvData.fullName || "YOUR NAME"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.personalDetailsTitle}>Personal Details</Text>
        <View style={styles.contactInfo}>
          {!isSkipped(cvData.email) && (
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Email:</Text>
              <Text style={styles.contactValue}>{cvData.email}</Text>
            </View>
          )}
          {!isSkipped(cvData.phone) && (
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Phone:</Text>
              <Text style={styles.contactValue}>{cvData.phone}</Text>
            </View>
          )}
          {!isSkipped(cvData.location) && (
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Location:</Text>
              <Text style={styles.contactValue}>{cvData.location}</Text>
            </View>
          )}
        </View>
      </View>

      {!isSkipped(cvData.summary) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.description}>{cvData.summary}</Text>
        </View>
      )}

      {cvData.jobs && cvData.jobs.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {cvData.jobs.map((job) => (
            <View key={job.id} style={styles.itemBlock}>
              <View style={styles.itemHeader}>
                <Text style={styles.title}>{job.title}</Text>
                <Text style={styles.date}>
                  {job.start} {job.start && job.end ? " — " : ""} {job.end}
                </Text>
              </View>
              {job.desc && <Text style={styles.description}>{job.desc}</Text>}
            </View>
          ))}
        </View>
      )}

      {cvData.education && cvData.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education & Certifications</Text>
          {cvData.education.map((ed) => (
            <View key={ed.id} style={styles.itemBlock}>
              <View style={styles.itemHeader}>
                <Text style={styles.title}>{ed.degree}</Text>
                {ed.gradDate && <Text style={styles.date}>Graduated: {ed.gradDate}</Text>}
              </View>
              {ed.certifications && <Text style={styles.certifications}>Certifications: {ed.certifications}</Text>}
            </View>
          ))}
        </View>
      )}

      {cvData.projects && cvData.projects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notable Projects</Text>
          {cvData.projects.map((proj) => (
            <View key={proj.id} style={styles.itemBlock}>
              <Text style={styles.title}>{proj.name}</Text>
              {proj.desc && <Text style={styles.description}>{proj.desc}</Text>}
              {proj.link && (
                <Link src={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} style={styles.link}>
                  {proj.link}
                </Link>
              )}
            </View>
          ))}
        </View>
      )}

      {!isSkipped(cvData.skills) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.description}>{cvData.skills}</Text>
        </View>
      )}

      {!isSkipped(cvData.references) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>References</Text>
          <Text style={styles.description}>{cvData.references}</Text>
        </View>
      )}
    </Page>
  </Document>
);

export default CVDocument;
