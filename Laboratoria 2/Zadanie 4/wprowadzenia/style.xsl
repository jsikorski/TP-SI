<?xml version="1.0"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="text" encoding="utf-8" omit-xml-declaration="yes" indent="no"></xsl:output>

	<xsl:template match="/">

		<xsl:for-each select="praca/rozdzial">
			<xsl:value-of select="concat('Rozdział {', @numer, '}:', '&#xA;', 
								  normalize-space(./text()))">
			</xsl:value-of>

			<xsl:if test="following-sibling::rozdzial">
				<xsl:text>&#xA;&#xA;</xsl:text>
			</xsl:if>
		</xsl:for-each>
	
	</xsl:template>
</xsl:stylesheet>