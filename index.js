const { DynamoDBClient, PutItemCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb')

/**
 * @class DynamoDBStorage
 */
module.exports = class DynamoDBStorage {
  dynamoClient
  tableName

  /**
   * Constructs DynamoDB migration storage.
   *
   * @param {object} [options]
   * @param {string} [options.tableName=''] - Name of the DynamoDB. Defaults to a empty string and will throw an error
   * if no table name is provided.
   * @param {string} [options.region='us-west-2'] - Region the DynamoDB table is in. Default to us-west-2 (Oregon).
   *
   * @throws Error
   */
  constructor ({ tableName = '', region = 'us-west-2' } = {}) {
    if (!tableName) {
      throw new Error('A "tableName" storage option is required.')
    }

    this.dynamoClient = new DynamoDBClient({ region })
    this.tableName = tableName
  }

  /**
   * Logs migration to be considered as executed
   *
   * @param migrationName - Name of the migration to be logged.
   * @returns {Promise}
   */
  async logMigration(migrationName) {
    return this.dynamoClient.send(new PutItemCommand({
      TableName: this.tableName,
      Item: {
        migrationName: { S: migrationName }
      }
    })).catch(e => {
      throw new Error('Failed to log migration: ' + e)
    }).then()
  }

  /**
   * Unlogs migration to be considered as pending.
   *
   * @param migrationName - Name of the migration to be logged.
   * @returns {Promise}
   */
  async unlogMigration(migrationName) {
    return this.dynamoClient.send(new DeleteItemCommand({
      TableName: this.tableName,
      Key: {
        migrationName: { S: migrationName }
      }
    })).catch(e => {
      throw new Error('Failed to unlog migration: ' + e)
    }).then()
  }

  /**
   * Get list of executed migrations.
   *
   * @returns {Promise.<String[]>}
   */
  async executed() {
    return this.dynamoClient.send(
      new ScanCommand({
        TableName: this.tableName
      })
    )
      .then(scanOutput => {
        const migrations = []
        scanOutput.Items.forEach(value => {
          migrations.push(value.migrationName)
        })
        return migrations
      })
      .catch((e) => {
        console.error(e)
        console.warn("Fail to get logged migrations. Returning an empty list.")
        return []
      })
  }
}
