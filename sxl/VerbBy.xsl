<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="1.0">
    <xsl:template match="/">
       <html>
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"  />
                <xsl:element name="title"><xsl:text>The Quranic Arabic Corpus - Verb Concordance</xsl:text></xsl:element>
                <link rel="stylesheet" type="text/css" href="index.css" media="all" />
            </head>
            <body> 
                <xsl:element name="table">
                <xsl:attribute name="class">verbTable</xsl:attribute>
                <xsl:attribute name="border">0</xsl:attribute>
                <xsl:attribute name="cellpadding">0</xsl:attribute>
                <xsl:attribute name="cellspacing">0</xsl:attribute>
                <tbody>
                    <tr>
                        <xsl:attribute name="class">head</xsl:attribute>
                        <td>Verb</td>
                        <td>Root</td>
                        <td>VerbOld</td>
                        <td>RootOld</td>
                        <td>Form</td>
                        <td>Frequency</td>
                        <td>Translation</td>
                    </tr>
                    <xsl:apply-templates/>
                </tbody>
            </xsl:element>
              <p>
                    <xsl:attribute name="style">font: 0.8333em Arial;</xsl:attribute>
                    <xsl:text>sort by frequency | </xsl:text>
                    <xsl:element name="a">
                        <xsl:attribute name="href">byroot.html</xsl:attribute>
                        <xsl:text>by root</xsl:text>
                    </xsl:element>
             </p>
            </body> 
    </html>
    </xsl:template>
    <xsl:template match="table/tbody//tr">
        <xsl:element name="tr">
            <xsl:element name="td">
                <xsl:attribute name="class">at</xsl:attribute>
                        <xsl:value-of select="td[1]/text()"/>
            </xsl:element>
            <xsl:element name="td">
               <xsl:attribute name="class">at</xsl:attribute>
                <xsl:value-of select="td[2]/text()"/>
            </xsl:element>
            <xsl:element name="td">
                <xsl:attribute name="class">ot</xsl:attribute>
                 <xsl:value-of select="td[1]/text()"/>
            </xsl:element>
            <xsl:element name="td">
             <xsl:attribute name="class">ot</xsl:attribute>
                <xsl:value-of select="td[2]/text()"/>
            </xsl:element>
            <xsl:element name="td">
               <xsl:value-of select="td[3]/text()"/>
            </xsl:element>
            <xsl:element name="td">
               <xsl:value-of select="td[4]/text()"/>
            </xsl:element>
            <xsl:element name="td">
              <xsl:value-of select="td[5]//text()"/>
            </xsl:element>
        </xsl:element>
    </xsl:template>
</xsl:stylesheet>