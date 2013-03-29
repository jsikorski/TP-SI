<?xml version="1.0"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" encoding="utf-8" omit-xml-declaration="yes" indent="yes"></xsl:output>

	<xsl:key name="authors" match="/praca/rozdzial/paragraf" use="@autor"/>

	<xsl:template match="/">
		<xsl:text disable-output-escaping="yes">&lt;!DOCTYPE html&gt;&#xA;&#xA;</xsl:text>

		<html>
			<head>
				<title>Bibliografia</title>
				<meta charset="utf-8"></meta>
			</head>
			<body>
				<xsl:for-each select="praca/rozdzial/paragraf[generate-id(.)=generate-id(key('authors', @autor))]">
					<h3><xsl:value-of select="@autor"></xsl:value-of></h3>

					<xsl:variable name="author" select="@autor"></xsl:variable>
					<xsl:variable name="author-paragraphs" select="../../rozdzial/paragraf[@autor = $author]">
					</xsl:variable>

					<table>
						<thead>
							<tr>
								<td>Nr rozdziału</td>
								<td>Nr paragrafu</td>
							</tr>
						</thead>
						<tbody>
							<xsl:for-each select="$author-paragraphs">
								<tr>
									<td><xsl:value-of select="../@numer"></xsl:value-of></td>
									<td><xsl:number></xsl:number></td>
								</tr>
							</xsl:for-each>
						</tbody>
						<tfoot>
							<tr>
								<td>Liczba:</td>
								<td><xsl:value-of select="count($author-paragraphs)"></xsl:value-of></td>
							</tr>
						</tfoot>
					</table>					

				</xsl:for-each>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>