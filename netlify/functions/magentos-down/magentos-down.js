const rootRespone = require('./json/root-response.json')
const productsBySku = require('./json/products-by-sku.json')
const productAggregations = require('./json/product-aggregations.json')
const productListingItems = require('./json/product-listing-items.json')
const customAttributeMetadata = require('./json/custom-attribute-metadata.json')

const handler = async (event) => {
	try {
		const params = event.queryStringParameters
		let body

		if (!params.query) body = rootRespone

		if (params.query) {
			if (params.query.startsWith('{ products( filter: { sku:')) {
				let sku = params.query.match(/sku: {eq: ".+"}/g)[0]
				sku = sku.split('"')[1]
				body = productsBySku.hasOwnProperty(sku)
					? productsBySku[sku]
					: productsBySku[Object.keys(productsBySku)[0]]
			}

			if (
				params.query.startsWith('{ products(filter: { category_id:') &&
				params.query.includes('aggregations')
			) {
				body = productAggregations
			}

			if (
				params.query.startsWith('{ products( filter: { category_id:') &&
				params.query.includes('{ items { uid sku name')
			) {
				body = productListingItems
			}

			if (params.query.startsWith('{ customAttributeMetadata')) {
				body = customAttributeMetadata
			}
		}

		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*', // Allow from anywhere
				'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
				'Access-Control-Allow-Headers':
					'Content-Type, Authorization, X-Requested-With, store',
			},
			body: JSON.stringify(body),
		}
	} catch (error) {
		return { statusCode: 500, body: error.toString() }
	}
}

module.exports = { handler }
