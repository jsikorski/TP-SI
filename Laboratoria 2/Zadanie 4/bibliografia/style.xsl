<?xml version="1.0"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" encoding="utf-8" omit-xml-declaration="yes" indent="yes"></xsl:output>
	
	<xsl:template match="/">
		<xsl:text disable-output-escaping="yes">&lt;!DOCTYPE html&gt;&#xA;&#xA;</xsl:text>

		<html>
			<head>
				<title>Bibliografia</title>
				<meta charset="utf-8"></meta>
			</head>
			<body>
				<table>
					<thead>
						<tr>
							<td>Nr rozdziału</td>
							<td>Wpis</td>
						</tr>
					</thead>
					<tbody>
						<xsl:for-each select="praca/rozdzial/bibliografia">
							<xsl:sort select="./text()"></xsl:sort>

							<tr>
								<td>
									<xsl:value-of select="../@numer"></xsl:value-of>
								</td>
								<td>
									<xsl:value-of select="./text()"></xsl:value-of>	
								</td>
							</tr>
						</xsl:for-each>
					</tbody>
				</table>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>