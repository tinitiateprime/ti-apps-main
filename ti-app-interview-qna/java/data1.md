# Can you explain the key features and benefits of AWS Glue for an ETL process?
* AWS Glue, a fully managed ETL service, streamlines data integration tasks with key features and benefits:
    - **Serverless architecture:** Eliminates infrastructure management, automatically provisions resources, and scales as needed.
    - **Crawlers:** Discovers and catalogs metadata from various sources, creating a unified view in the Glue Data Catalog.
    - **Schema detection:** Identifies schema changes and adapts ETL jobs accordingly, reducing manual intervention.
    - **Code generation:** Generates customizable PySpark or Scala code for ETL jobs, accelerating development.
    - **Job orchestration:** Integrates with AWS Step Functions to coordinate complex workflows across multiple services.
    - **Flexibility:** Supports diverse data formats, storage systems, and processing engines (e.g., Apache Spark, Hadoop).
    - **Cost-effective:** Pay-as-you-go pricing model based on job runtime and data processed, optimizing costs.

# Describe the architecture and components of AWS Glue, including how data catalog, classification, and extraction work in the system.
* AWS Glue is a fully managed ETL (Extract, Transform, Load) service that simplifies data integration tasks.

**Its architecture consists of three main components:**
- **Data Catalog:** A centralized metadata repository storing table definitions, schema information, and other metadata. It integrates with Amazon S3, RDS, Redshift, and other AWS services to discover and store this information.
- **Crawlers:** Automated programs that connect to data sources, extract metadata, and classify the data by inferring its schema. They then store this information in the Data Catalog for future use.
- **Jobs:** ETL scripts written in Python or Scala using Apache Spark framework. These jobs read from the Data Catalog, transform the data, and load it into target destinations like S3, RDS, or Redshift.

**Data classification and extraction** occur during the crawling process. Crawlers use built-in classifiers to recognize common file formats (e.g., CSV, JSON, Parquet) and infer schemas based on the data’s structure. Custom classifiers can be created using Grok patterns or custom Python code if needed.

# How does AWS Glue handle schema evolution, and what options are available for tracking schema changes?
* AWS Glue handles schema evolution through its Data Catalog, which automatically detects and stores schema changes.
* When a new dataset with an evolved schema is processed, Glue merges the old and new schemas by adding new columns and maintaining existing ones.

**Two options for tracking schema changes are:**
- **Table versioning:** Enable this feature in the Data Catalog to store multiple versions of table metadata, allowing you to track schema history.
- **Schema change detection policies:** Configure these policies to control how Glue should handle schema changes during ETL jobs (e.g., Ignore or Fail).

# What are some common AWS Glue crawler performance issues and how can they be addressed?
**Common AWS Glue crawler performance issues include:**
- **Slow Crawling:** This can be caused by large data sets, complex schemas, or insufficient resources. To address this issue, consider increasing the Data Processing Units (DPUs) allocated to your crawler, partitioning your data, or using a more efficient file format like Parquet.
- **Crawler Timeout:** If a crawler takes too long to complete, it may time out. Increase the timeout value in the crawler settings or optimize your data source for faster crawling.
- **Incomplete Schema Detection:** The crawler might not detect all columns if there are many small files with different schemas. Consolidate similar files and ensure consistent schema across files.
- **Excessive API Calls:** Frequent crawls on rapidly changing data sources can lead to throttling of API calls. Schedule crawlers less frequently or use event-driven triggers instead of scheduled ones.
- **Permission Issues:** Ensure that the IAM role associated with the crawler has necessary permissions to access the data source and write metadata to the Data Catalog.
- **Unsupported Formats:** Some formats, such as XML, require custom classifiers. Create and configure a custom classifier to crawl unsupported formats.

# What are the differences between using AWS Glue’s dynamic frames and Apache Spark’s data frames in your ETL scripts?
**Dynamic frames and Spark data frames differ in several aspects:**
- **Schema flexibility:** Dynamic frames offer schema evolution support, handling changes in source data without modifying ETL scripts. Spark data frames require a fixed schema.
- **Data quality:** Dynamic frames provide built-in error handling for corrupt records, while Spark data frames may fail or produce incorrect results when encountering bad data.
- **Relational operations:** Dynamic frames simplify relational transformations with push-down predicates and optimized joins. Spark data frames rely on manual optimizations using Catalyst query optimizer.
- **Performance:** AWS Glue’s dynamic frames are designed for large-scale ETL workloads, offering better performance through partitioning and compression techni Spark data frames may need additional tuning for optimal performance.
- **Integration:** Dynamic frames seamlessly integrate with other AWS services like S3, Redshift, and RDS. Spark data frames require additional connectors for integration.
- **Language support:** Both dynamic frames and Spark data frames support Python and Scala languages for ETL scripting.

# Can you explain the purpose and usage of AWS Glue Bookmarks? Provide examples of when you might want to use them.
* AWS Glue Bookmarks serve as checkpoints for ETL jobs, tracking processed data and enabling incremental processing.
* They help avoid reprocessing unchanged data, improving efficiency and reducing job runtime.

**Use cases include:**
- **Incremental updates:** When ingesting new or updated records from a source, bookmarks identify previously processed data, ensuring only new information is processed.
- **Recovering from failures:** If an ETL job fails, bookmarks allow restarting from the last successful checkpoint instead of reprocessing all data.

**Example:** 
* Consider an e-commerce platform with daily order data.
* Using AWS Glue without bookmarks would require reprocessing all historical orders each time.
* With bookmarks enabled, only new orders are processed, saving time and resources.

# How does AWS Glue handle job retries, and what are some best practices for handling failures in a Glue job?
* AWS Glue handles job retries through the “MaxRetries” parameter, which specifies the maximum number of times a job will be retried upon failure.
* By default, it is set to zero, meaning no retries occur.

**Best practices for handling failures in a Glue job include:**
- Implementing error handling and logging within your ETL script to capture issues and provide insights.
- Utilizing AWS Glue’s built-in data validation features like schema inference and data type conversion to minimize errors.
- Monitoring CloudWatch metrics and setting up alarms to notify you when specific thresholds are breached.
- Using AWS Glue bookmarks to track processed data and resume from the last successful point in case of failure.
- Employing idempotent operations to ensure that retrying a failed job does not result in duplicate processing or unintended side effects.
- Adjusting the MaxRetries parameter based on your use case and tolerance for transient failures.
- Analyzing job logs and history to identify patterns and root causes of failures, then addressing them accordingly.

# What are the security features in AWS Glue, such as encryption and VPC endpoints, and how do they help ensure data security during ETL operations?
* AWS Glue security features include encryption, VPC endpoints, and IAM policies.
* Data encryption in AWS Glue is achieved through AWS Key Management Service (KMS) for data at rest and SSL/TLS for data in transit.
* KMS provides centralized control over cryptographic keys, enabling secure access to encrypted data.
* SSL/TLS ensures secure communication between components during ETL operations.
* VPC endpoints allow private connections between your VPC and AWS Glue without traversing the public internet, reducing exposure to external threats.
* They use AWS PrivateLink technology, ensuring network traffic remains within the Amazon network.
* IAM policies help manage user permissions and access to AWS Glue resources.
* Fine-grained access control can be applied to specific actions, preventing unauthorized users from accessing sensitive data or performing critical tasks.
* These security features work together to protect data throughout the ETL process, minimizing risks associated with data breaches and unauthorized access.

# Describe an instance in which you had to optimize an AWS Glue job for cost and performance. What steps did you take, and what were the outcomes?
* In a recent project, I had to optimize an AWS Glue job that processed large amounts of data from multiple sources.
* The initial setup was slow and costly due to inefficient resource allocation and suboptimal configurations.

**To optimize the job, I took the following steps:**
- Analyzed the job metrics in CloudWatch to identify bottlenecks.
- Increased the number of DPUs (Data Processing Units) for faster processing.
- Enabled job bookmarking to process only new or changed data, reducing unnecessary work.
- Partitioned input/output datasets based on common attributes, improving parallelism.
- Utilized column projections to read only required columns, minimizing data movement.
- Optimized transformation logic by using built-in Glue functions instead of custom code.
- Scheduled the job during off-peak hours to take advantage of lower costs.

# Can you explain the process of integrating data sources with AWS Glue, including supported sources and connectivity options?
* AWS Glue integrates data sources through a process called “crawling.” Crawlers connect to supported sources, extract metadata, and create table definitions in the AWS Glue Data Catalog.
* Supported sources include Amazon S3, Amazon RDS, Amazon Redshift, and JDBC databases.

**To integrate data sources with AWS Glue:**
- **Create a crawler:** Define source type, connection details, and IAM role for access.
- **Configure connectivity options:** For JDBC databases, use Glue Connection with appropriate JDBC URL, username, and password. For other sources, specify their respective URIs.
- **Set up target schema:** Choose an existing database or create a new one in the Data Catalog.
- **Schedule crawlers:** Run on-demand or set up a schedule based on your requirements.
- **Monitor progress:** Use CloudWatch metrics and logs to track crawler activity.
- **Review results:** Examine created tables and schemas in the Data Catalog.

# What are some limitations of AWS Glue, and how have you worked around these limitations in your past projects?
* AWS Glue has several limitations, including limited support for complex data types, slow ETL job execution, and lack of fine-grained control over resources.
* In my past projects, I have addressed these issues in the following ways:
    - For complex data types, I preprocessed the data using custom Python or Scala scripts to simplify it before ingesting into Glue.
    - To improve ETL performance, I partitioned input data and increased the number of DPUs (Data Processing Units) allocated to jobs.
    - I utilized AWS Lambda functions for lightweight transformations that didn’t require full-fledged ETL capabilities.
    - When more control over resources was needed, I opted for Apache Spark on Amazon EMR instead of Glue, allowing me to configure cluster settings manually.
    - I monitored and optimized Glue job costs by analyzing CloudWatch metrics and adjusting DPU allocations accordingly.

# How do you use AWS Glue to handle slowly changing dimensions in your ETL pipeline?
**To handle slowly changing dimensions (SCD) in an ETL pipeline using AWS Glue, follow these steps:**
* **Identify the SCD type:** Determine if you’re dealing with Type 1 (overwrite), Type 2 (add new row), or Type 3 (add new column).
* **Create a Glue job:** Develop a PySpark or Scala script to implement the desired SCD logic and create a Glue job.
* **Use DynamicFrames:** Leverage Glue’s DynamicFrame API for schema flexibility during transformations.
* **Implement SCD logic:** For Type 1, use ‘apply_mapping’ and ‘resolve_choice’; for Type 2, use ‘join’ and ‘union’; for Type 3, use ‘apply_mapping’, ‘resolve_choice’, and ‘rename_field’.
* **Write transformed data:** Store the processed data in your target database or storage service (e.g., Amazon Redshift, S3).
* **Schedule the job:** Set up triggers or cron expressions to run the Glue job at regular intervals.

# Can you describe the role of AWS Glue triggers, and provide examples of different types of triggers that you have utilized in your projects?
* AWS Glue triggers play a crucial role in orchestrating and automating ETL workflows.
* They initiate jobs based on specific conditions, ensuring seamless data processing and transformation.

**In my projects, I’ve utilized three types of triggers:**
* **On-demand:** Manually initiated for ad-hoc tasks or testing purposes.
```glue
glue.create_trigger(Name='OnDemandTrigger', Type='ON_DEMAND',
 Actions=[{'JobName': 'SampleJob'}])
```
* **Scheduled:** Executes jobs at regular intervals using cron expressions.
```glue
glue.create_trigger(Name='ScheduledTrigger', Type='SCHEDULED',
 Schedule='cron(0 12 * * ? *)', Actions=[{'JobName': 'DailyJob'}])
```
* **Conditional (Event-based):** Activated when specified events occur, such as job completion or failure.
```glue
glue.create_trigger(Name='ConditionalTrigger', Type='CONDITIONAL',
 Predicate={'Conditions': [{'LogicalOperator': 'EQUALS', 'JobName': 
 'PredecessorJob', 'State': 'SUCCEEDED'}]},
  Actions=[{'JobName': 'SuccessorJob'}])
```
These triggers have enabled efficient workflow management, reducing manual intervention and improving overall data pipeline performance.

# What are the benefits of using AWS Glue over Amazon EMR for ETL workloads, and when might you choose one over the other?
* AWS Glue offers several benefits over Amazon EMR for ETL workloads.
* Firstly, it is serverless, eliminating the need to manage infrastructure and scaling resources.
* This results in cost savings as you only pay for consumed resources during job execution.
* Secondly, AWS Glue provides a fully managed ETL service with built-in data cataloging, simplifying schema discovery, conversion, and management.
* Thirdly, it supports both Python and Scala languages, offering flexibility in coding.
* However, there are scenarios where Amazon EMR might be preferred.
* If your use case requires extensive customization or complex processing beyond standard ETL operations, EMR’s support for various big data frameworks like Apache Spark, Hadoop, and Hive can be advantageous.
* Additionally, if you have existing on-premises Hadoop clusters, migrating to EMR may be more seamless than adopting AWS Glue.

# Explain how to use AWS Glue’s Machine Learning Transformations for data cleansing and preparation.
**To use AWS Glue’s Machine Learning Transformations for data cleansing and preparation, follow these steps:**
* **Create a Crawler:** Set up a crawler to extract metadata from your source data store and populate the Data Catalog.
* **Define Schema:** Review and modify the schema generated by the crawler if necessary.
* **Develop ML Transforms:** Use FindMatches and LabelingSetGeneration transforms for deduplication and record matching tasks.
* **Train ML Model:** Generate labeling sets using LabelingSetGeneration transform, label them manually or programmatically, and train the model with labeled data.
* **Apply ML Model:** Use the trained model in FindMatches transform to cleanse and prepare data by identifying duplicate records and merging them.
* **Create Job:** Develop an ETL job that uses the ML transforms along with other transformations like mapping, filtering, and joining to process the data.
* **Execute and Monitor:** Run the job on-demand or schedule it, monitor its progress, and review logs for troubleshooting.

# Can you discuss the best practices for monitoring and logging AWS Glue jobs, including integration with Amazon CloudWatch?
**To effectively monitor and log AWS Glue jobs, follow these best practices:**
* **Enable job metrics:** Activate CloudWatch Metrics for Glue jobs to track performance indicators like execution time, success rate, and data processing rates.
* **Set up alarms:** Configure CloudWatch Alarms based on specific metric thresholds to receive notifications when issues arise or performance degrades.
* **Use CloudWatch Logs:** Integrate Glue job logs with CloudWatch Logs for centralized storage, analysis, and visualization of log data.
* **Create custom dashboards:** Utilize CloudWatch Dashboards to visualize key metrics and trends in a single view, enabling faster identification of potential problems.
* **Monitor ETL script errors:** Track Python Shell and Apache Spark application logs within CloudWatch Logs to identify and troubleshoot script-related issues.
* **Optimize job configurations:** Regularly review and adjust Glue job settings such as memory allocation, worker type, and timeout values to improve performance and resource utilization.
* **Leverage AWS Glue Job bookmarks:** Employ bookmarks to maintain state information between job runs, ensuring efficient incremental processing and reducing the risk of duplicate or missed records.

# Describe the process of setting up a continuous integration and continuous deployment (CI/CD) pipeline for AWS Glue jobs.
**To set up a CI/CD pipeline for AWS Glue jobs, follow these steps:**
* Create an AWS CodeCommit repository to store your Glue job scripts and related files.
* Set up an AWS CodeBuild project to build and package the Glue job artifacts. Configure the source as the CodeCommit repository and specify the build environment (e.g., Python 3.7). Add necessary build commands in the buildspec.yml file, such as installing dependencies and packaging the script.
* Create an Amazon S3 bucket to store the built artifacts.
* Configure an AWS CodePipeline with two stages: Source and Build. In the Source stage, connect to the CodeCommit repository. In the Build stage, use the CodeBuild project created earlier and output the artifacts to the S3 bucket.
* Use AWS CloudFormation or AWS CDK to define the infrastructure required for deploying the Glue job, including IAM roles, Glue connections, and other resources.
* Extend the pipeline by adding a Deploy stage that uses AWS CloudFormation or AWS CDK to deploy the infrastructure and create/update the Glue job using the artifacts from the S3 bucket.
* Configure notifications, monitoring, and logging for the pipeline using services like Amazon SNS, Amazon CloudWatch, and AWS X-Ray.

# How do you handle error propagation and handling in your ETL scripts with AWS Glue?
**To handle error propagation and handling in ETL scripts with AWS Glue, follow these steps:**
* **Use try-except blocks:** Encapsulate code that may raise exceptions within try-except blocks to catch errors and perform necessary actions.
* **Utilize Glue’s built-in error handling:** Leverage Glue’s Job Bookmark feature for recovery from failures by enabling it in the job configuration.
* **Implement custom logging:** Integrate Python’s logging module or use GlueContext’s write_dynamic_frame_from_options() method to log errors into Amazon S3 or other storage services.
* **Validate data quality:** Perform data validation checks using DynamicFrame’s filter() and drop_fields() methods to ensure only correct data is processed.
* **Monitor Glue jobs:** Set up CloudWatch alarms to monitor job metrics like success rate, execution time, and error count for proactive issue detection.
* **Retry failed jobs:** Configure Glue job retries through Maximum Retries parameter in job settings to automatically retry upon failure.
* **Handle schema evolution:** Use Glue’s Schema Registry to manage schema changes and avoid issues caused by evolving data structures.

# What are the storage options available for intermediate and output data in AWS Glue, and how do they affect job performance?
* AWS Glue offers two storage options for intermediate and output data: Amazon S3 and AWS Glue Data Catalog.
    * Amazon S3 is a highly scalable, durable, and available object storage service. Using S3 as an intermediate or output storage option provides high throughput and low latency, improving job performance. However, it may incur additional costs due to data transfer and storage.
    * AWS Glue Data Catalog is a managed metadata repository that stores table definitions and schema information. Storing intermediate data in the Data Catalog can improve job performance by reducing data movement between stages. However, using Data Catalog for output data might not be suitable for large datasets due to its limited storage capacity.
* To optimize job performance, consider partitioning your data in S3, enabling compression, and using columnar formats like Parquet or ORC. Additionally, choose appropriate worker types and allocate sufficient memory resources for your Glue jobs.

# How do you create custom classifiers in AWS Glue? Provide an example use case.
**To create custom classifiers in AWS Glue, follow these steps:**
* Navigate to the AWS Glue Console and select “Classifiers” under “Data Catalog.”
* Click “Add classifier” and choose a classifier type: Grok, JSON, XML, or CSV.
* Provide a name for the classifier and configure its properties based on the chosen type.
* For Grok, specify a custom Grok pattern; for JSON/CSV/XML, provide row tag/path/separator respectively.
* Optionally, add custom prefix mappings for column names if needed.
* Save the classifier and use it within your Glue ETL jobs by referencing its name.

**Example use case:** Parsing web server logs with a custom Grok pattern.
* Create a Grok classifier with a pattern like “%{IP:client} \[%{TIMESTAMP_ISO8601:timestamp}\] \”%{WORD:method} %{URIPATHPARAM:request} HTTP/%{NUMBER:httpversion}\” %{NUMBER:response} %{NUMBER:bytes}”
* Use this classifier in a Glue job to extract structured data from raw log files stored in S3.

# Can you explain the process of troubleshooting a failed AWS Glue job, including log analysis and diagnostic tools?
**To troubleshoot a failed AWS Glue job, follow these steps:**
* **Check CloudWatch Logs:** Review the logs for errors or warnings. Look for “ERROR” and “WARN” keywords to identify issues.
* **Analyze Job Metrics:** Use CloudWatch metrics to monitor job performance, such as memory usage, execution time, and data processing rates.
* **Enable Continuous Logging:** If not enabled, turn on continuous logging in the job settings for detailed log information during runtime.
* **Examine Job Bookmark:** Investigate if the job bookmark is causing issues by disabling it temporarily and rerunning the job.
* **Validate ETL Script:** Ensure the correctness of your script, including syntax, input/output formats, and transformations.
* **Test Data Catalog:** Verify that the source and target tables are correctly defined in the Glue Data Catalog.
* **Utilize Support Tools:** Leverage AWS Glue troubleshooting tools like Development Endpoints and Glue Studio for debugging and testing.

# How does AWS Glue’s schema inference capabilities work, and when would you use this feature instead of providing a predefined schema?
* AWS Glue’s schema inference capabilities work by automatically discovering, inferring, and mapping the source data schema to a target schema.
* It uses built-in classifiers that recognize various data formats (e.g., JSON, CSV, Parquet) and extract the schema information from them.
* Additionally, it can handle semi-structured or unstructured data using custom classifiers.
* You would use this feature instead of providing a predefined schema when dealing with unknown, frequently changing, or complex data sources.
* Schema inference simplifies the ETL process, reduces manual intervention, and adapts to evolving data structures without requiring constant updates to the predefined schema.

# What are some strategies for performing incremental data updates in your ETL pipeline using AWS Glue?
**To perform incremental data updates in an ETL pipeline using AWS Glue, consider the following strategies:**
* **Use Job Bookmarks:** Enable job bookmarks to track processed data and resume from where it left off during the next run. This avoids reprocessing of already processed records.
* **Utilize CDC (Change Data Capture) tools:** Integrate with third-party CDC tools like Apache Kafka or AWS DMS to capture changes in source databases and process only changed records in Glue ETL jobs.
* **Timestamp-based Incremental Updates:** Add a timestamp column to your source data and use it as a filter condition in Glue ETL scripts to process only new or updated records since the last execution.
* **Partitioning:** Leverage partitioning on S3 or other storage systems based on time or other relevant attributes. Process only newly created partitions in Glue ETL jobs.
* **Delta Lake Integration:** Use Delta Lake format for storing data, which maintains transaction logs and enables processing only the delta changes in Glue ETL jobs.
* **Custom Checkpoints:** Implement custom checkpoints by storing metadata about processed data in DynamoDB or another database, then use this information to determine what data needs processing in subsequent runs.

# How do you partition your data in AWS Glue to optimize performance and reduce query latency?
**To optimize performance and reduce query latency in AWS Glue, follow these steps:**
* **Identify partition keys:** Choose columns with high cardinality and evenly distributed values to avoid data skew.
* Use the **CreateTable API or AWS Management Console** to define a schema with partition keys.
* Configure **crawlers** to detect partitions automatically by enabling “Add new columns only” option.
* **Optimize file formats:** Convert raw data into columnar formats like Parquet or ORC for better compression and faster querying.
* **Leverage partition pruning:** Filter queries using partition key conditions to read only relevant data.
* **Consider dynamic partitioning:** In ETL jobs, use DynamicFrame’s write_dynamic_frame method with appropriate options to create optimized partitions.

# Can you describe an instance in which you had to extend the functionality of AWS Glue using custom Python or Scala libraries? What was the use case and outcome?
* In a previous project, we needed to extend AWS Glue’s functionality for data transformation and enrichment.
* The use case involved ingesting raw data from various sources, transforming it into a standardized format, and enriching it with additional information fetched from external APIs.
* We chose Python as our language and developed custom libraries that integrated seamlessly with the built-in Glue libraries.
* Our custom library included functions for data validation, transformation rules, and API calls for data enrichment.
* The outcome was successful, as our custom libraries enabled us to perform complex transformations and enrichments within the Glue ETL process.
* This resulted in improved data quality and reduced processing time compared to using separate services for each step of the process.

# Mention some of the significant features of AWS Glue.
* You can leverage AWS Glue to discover, transform, and prepare your data for analytics.
* In addition to databases running on AWS, Glue can automatically find structured and semi-structured data kept in your data lake on Amazon S3, data warehouse on Amazon Redshift, and other storage locations.
* Glue automatically creates Scala or Python code for your ETL tasks, which you can modify using tools you are already comfortable with.
* Furthermore, AWS Glue DataBrew allows you to visually clean and normalize data without any code.

# What is the process for adding metadata to the AWS Glue Data Catalog?
* There are several ways to add metadata to the AWS Glue Data Catalog using AWS Glue.
* The Glue Data Catalog is loaded with relevant table definitions and statistics as the Glue crawlers automatically analyze different data stores you own to deduce schemas and partition structures.
* Alternatively, you can manually add and change table details using the AWS Glue Console or the API.
* On an Amazon EMR cluster, you can also execute Hive DDL statements via the Amazon Athena Console or a Hive client.

# What client languages, data formats, and integrations does AWS Glue Schema Registry support?
* The Schema Registry supports Java client apps and the Apache Avro and JSON Schema data formats.
* The Schema Registry is compatible with apps made for Apache Kafka, Amazon Managed Streaming for Apache Kafka (MSK), Amazon Kinesis Data Streams, Apache Flink, Amazon Kinesis Data Analytics for Apache Flink, and AWS Lambda.

# Does the AWS Glue Schema Registry offer encryption in both transit and storage?
* Yes, with API calls that use TLS encryption over HTTPS, your customers' communication with the Schema Registry is encrypted as it transits between them.
* A service-managed KMS key is always used to encrypt schemas while they are being stored in the Schema Registry.

# Where do you find the AWS Glue Data Quality scores?
* Scores for data quality are displayed in your table's Data Quality page from the Data Catalog.
* When creating an AWS Glue Studio job, you can see your data pipeline scores by selecting Data Quality.
* Your data quality jobs can be set up to publish their results to an Amazon Simple Storage Service (S3) bucket.
* Then, you can use Amazon QuickSight or Amazon Athena to query this data.

# In the AWS Glue Catalog, how do you list databases and tables?
**Using the command below, one can list databases and tables:**
```glue
import boto3

client = boto3.client('glue',region_name='us-west-1')

responseGetDatabases = client.

get_databases()

databaseList = response

GetDatabases['DLIST']

for databaseDict in databaseList:

   databaseName = databaseDict['ABC']

    print '\ndatabaseABC: ' + databaseXYZ

response

GetTables = client.

get_tables( DatabaseName = databaseXYZ )

tableList = response

GetTables['TLIST']

for tableDict in tableList:

     tableName = tableDict['DEF']

     print '\n-- tableDEF: '+tableDEF
```

# How will you modify Duplicating Data using AWS Glue?
**Using the following command, AWS Glue enables you to update Duplicating Data:**
```glue
sc = SparkContext()

glueContext = GlueContext(sc)

src_data = create_dynamic_frame.from_catalog(database = src_fg,
 table_name = src_fg)

src_df =  src_data.toDF()

dst_data = create_dynamic_frame.from_catalog(database = dst_fg,
 table_name = dst_fg)

dst_df =  dst_data.toDF()

merged_df = dst_df.union(src_df)

merged_df.write.format('xyz').
```

# In AWS Glue, how do you enable and disable a trigger?
* A trigger can be turned on or off using the AWS Glue console, AWS Command Line Interface (AWS CLI), or AWS Glue API.
* For example, you can use the following commands to start or stop triggers using the AWS CLI-
```glue
aws glue start-trigger --name MyTrigger  

aws glue stop-trigger --name MyTrigger
```

# How do you identify which version of Apache Spark is AWS Glue using?
* By looking at the Glue version number, you can find out which version of Apache Spark is being used by AWS Glue.
* The version number is shown on the AWS Glue console, and you can also retrieve it using the following command: `aws glue get-spark-version`.

# How do you add a trigger using the AWS CLI in AWS Glue?
* You must enter a command similar to the one below.
```glue
aws glue create-trigger --name MyTrigger --type SCHEDULED --schedule  
"cron(0 12 * * ? *)" --actions CrawlerName=MyCrawler --start-on-creation  
```
* With this command, a crawler named MyCrawler is launched along with a schedule trigger called MyTrigger that runs daily at 12:00 UTC.

# Suppose there is a communication issue with OnPrem, and it is necessary for the job to be automatically re-executed to ensure data integrity. Can you find a way for a job to retry execution after a failure?
* The MaxRetries option in Glue has a native retry mechanism.
* If using Glue Studio, the "Job Details" tab allows you to define this parameter programmatically.
* MaxRetries – Number (integer). The maximum number of attempts to retry this job once a JobRun fails.

# How do you handle incremental updates to data in a data lake using Glue?
* You can mention using Glue Crawler to identify any changes in the source data and update the Glue Data Catalog accordingly.
* After which, you can create a glue job that uses the Glue Data Catalog table to extract the updated data from the source, transforms it, and appends it to the data in the data lake.
* Also, you can use AWS Glue’s incremental loading feature to load the data.

# Suppose that you have a JSON file in S3. How will you use Glue to transform it and load the data into an AWS Redshift table?
* Use glue crawler to find out the schema of the JSON file in S3. This will help create a glue data catalog table.
* Create a glue job to extract the JSON data from S3 and apply transformations either by using in-built glue transformations or by writing custom PySpark or Scala code.
* Transformed data can then be loaded into the Redshift table using the redshift connector. 

# How would you extract data from the ProjectPro website, transform it, and load it into an Amazon DynamoDB table?
* Create a glue job to use the in-built glue web scraping library to scrape and extract data from ProjectPro website.
* Transform the extracted data into a format that can be loaded into DynamoDB table using the Dataframe API.
* Use DynamoDB glue connector to load the data.

# Assume you’re working for a company in the BFSI domain with lots of sensitive data. How can you secure this sensitive information in a glue job?
* You can answer this question by mentioning using AWS Key Management Service, which lets you encrypt sensitive data.
* Another probable solution is using in-built support for data redaction and masking provided by Glue to redact or mask the sensitive data.

# What is AWS Glue?
* AWS Glue is a managed service ETL (extract, transform, and load) service that enables categorizing, cleaning, enriching, and moving data reliably between various data storage and data streams simple and cost-effective.
* AWS Glue consists of the AWS Glue Data Catalog, an ETL engine that creates Python or Scala code automatically, and a customizable scheduler that manages dependency resolution, job monitoring, and retries.
* Because AWS Glue is serverless, there is no infrastructure to install or maintain.

# Describe AWS Glue Architecture
* The fundamentals of using AWS Glue to generate one's Data Catalog and processing ETL dataflows.
* In AWS Glue, users create tasks to complete the operation of extracting, transforming, and loading (ETL) data from a data source to a data target.

**You usually do the following:**
- You construct a crawler for datastore resources to enrich one's AWS Glue Data Catalog with metadata table entries. When you direct your crawler to a data store, the crawler populates the Data Catalog with table definitions. Manually define Data Catalog tables and data stream characteristics for streaming sources.
- In addition to table descriptions, the AWS Glue Data Model contains additional metadata that is required to build ETL operations. Users use this information when they take on that job to alter their data.
- AWS Glue may generate a data transformation script. Users can also provide the script using the AWS Glue console or API.
- Users could complete their task immediately or set it to start when another incidence occurs. The trigger could be a timer or an event.
- When a user's task starts, a script pulls information from the user's data source, modifies it, and sends it to the user's data target. The script is run in an Apache Spark environment through AWS Glue.

# What are the Features of AWS Glue?
- **Automatic Schema Discovery:** Enables crawlers to automatically acquire scheme-related information and store it in a data catalog.
- **Job Scheduler:** Several jobs can be initiated simultaneously, and users can specify job dependencies.
- **Developer Endpoints:** Aid in creating bespoke readers, writers, and transformations.
- **Automatic Code Generation (ACG):** Aids in building code.
- **Integrated Data Catalog:** The AWS pipeline's Integrated Data Catalog stores various sources.

# What are the Benefits of AWS Glue?
- **Fault Tolerance:** AWS Glue logs can be debugged and retrieved.
- **Filtering:** For poor data, AWS Glue employs filtering.
- **Maintenance and Development:** AWS Glue relies on maintenance and deployment because AWS manages the service.

# When to use a Glue Classifier?
* A Glue Classifier is used to crawl a data store in the AWS Glue Data Catalog to generate metadata tables.
* An ordered set of classifiers can be used to configure your crawler. When a crawler calls a classifier, the classifier determines whether or not the data is recognized.
* If the first classifier fails to acknowledge the data or is unsure, the crawler moves to the next classifier in the list to see if it can.

# What are the main components of AWS Glue?
**AWS Glue’s main components are as follows:**
- **Data Catalog:** Acts as a central metadata repository.
- **ETL engine:** Can automatically generate Scala or Python code.
- **Flexible scheduler:** Manages dependency resolution, job monitoring, and retries.
- **AWS Glue DataBrew:** Allows the user to clean and stabilize data using a visual interface.
- **AWS Glue Elastic View:** Enables users to combine and replicate data across multiple data stores. These solutions will allow you to spend more time analyzing your data by automating most of the non-differentiated labor associated with data search, categorization, cleaning, enrichment, and migration.

# What Data Sources are supported by AWS Glue?
* AWS Glue's data sources include:
    - Amazon Aurora
    - Amazon RDS for MySQL
    - Amazon RDS for Oracle
    - Amazon RDS for PostgreSQL
    - Amazon RDS for SQL Server
    - Amazon Redshift
    - DynamoDB
    - Amazon S3
    - MySQL
    - Oracle
    - Microsoft SQL Server

# What is AWS Glue Data Catalog?
* Your persistent metadata repository is AWS Glue Data Catalog.
* It's a managed service that allows you to store, annotate, and exchange metadata in the AWS Cloud in the same way as an Apache Hive metastore does.
* AWS Glue Data Catalogs are unique to each AWS account and region.
* It creates a centralized location where diverse systems may store and get metadata to maintain data in data silos and query and alter the data using that metadata.
* Access to the data sources handled by the AWS Glue Data Catalog can be controlled with AWS Identity and Access Management (IAM) policies.

# Which AWS services and open-source projects use AWS Glue Data Catalog?
* The AWS Glue Data Catalog is used by the following AWS services and open-source projects:
    - AWS Lake Formation
    - Amazon Athena
    - Amazon Redshift Spectrum
    - Amazon EMR
    - AWS Glue Data Catalog Client for Apache Hive Metastore

# What are AWS Glue Crawlers?
* AWS Glue crawler is used to populate the AWS Glue catalog with tables.
8 It can crawl many data repositories in one operation.
* One or even more tables in the Data Catalog are created or modified when the crawler is done.
* In ETL operations defined in AWS Glue, these Data Catalog tables are used as sources and targets.
* The ETL task reads and writes data to the Data Catalog tables in the source and target.

# What is the AWS Glue Schema Registry?
* The AWS Glue Schema Registry assists us by allowing us to validate and regulate the lifecycle of streaming data using registered Apache Avro schemas at no cost.
* Apache Kafka, Amazon Managed Streaming for Apache Kafka (MSK), Amazon Kinesis Data Streams, Apache Flink, Amazon Kinesis Data Analytics for Apache Flink, and AWS Lambda benefit from Schema Registry.

# Why should we use AWS Glue Schema Registry?
**You can use the AWS Glue Schema Registry to:**
- **Validate schemas:** Schemas used for data production are checked against schemas in a central registry when data streaming apps are linked with AWS Glue Schema Registry, allowing you to regulate data quality centrally.
- **Safeguard schema evolution:** One of eight compatibility modes can be used to specify criteria for how schemas can and cannot grow.
- **Improve data quality:** Serializers compare data producers' schemas to those in the registry, enhancing data quality at the source and avoiding downstream difficulties caused by random schema drift.
- **Save costs:** Serializers transform data into a binary format that can be compressed before transferring, lowering data transfer and storage costs.
- **Improve processing efficiency:** A data stream frequently comprises records with multiple schemas. The Schema Registry allows applications that read data streams to process each document based on the schema rather than parsing its contents, increasing processing performance.

# When should I use AWS Glue vs. AWS Batch?
* AWS Batch enables you to conduct any batch computing job on AWS with ease and efficiency, regardless of the work type.
* AWS Batch maintains and produces computing resources in your AWS account, giving you complete control over and insight into the resources in use.
* AWS Glue is a fully-managed ETL solution that runs your ETL tasks in a serverless Apache Spark environment.
* We recommend using AWS Glue for your ETL use cases.
* AWS Batch might be a better fit for some batch-oriented use cases, such as ETL use cases.

# What kinds of evolution rules does AWS Glue Schema Registry support?
* Backward, Backward All, Forward, Forward All, Full, Full All, None, and Disabled are the compatibility modes accessible to regulate your schema evolution. 

# How does AWS Glue Schema Registry maintain high availability for applications?
* The AWS Glue SLA is underpinned by the Schema Registry storage and control plane, and the serializers and deserializers use best-practice caching strategies to maximize client schema availability.

# Is AWS Glue Schema Registry open-source?
* The serializers and deserializers are Apache-licensed open-source components, but the Glue Schema Registry storage is an AWS service.

# How does AWS Glue relate to AWS Lake Formation?
* AWS Lake Formation benefits from AWS Glue's shared infrastructure, which offers console controls, ETL code development and task monitoring, a shared data catalog, and serverless architecture.
* Lake Formation features AWS Glue capability and additional capabilities for constructing, securing, and administering data lakes, even though AWS Glue is still focused on such types of procedures.

# What are Development Endpoints?
* The term "development endpoints" is used to describe the AWS Glue API's testing capabilities when utilizing Custom DevEndpoint.
* A developer may debug the extract, transform, and load ETL Scripts at the endpoint.

# What are AWS Tags in AWS Glue?
* A tag is a label you apply to an Amazon Web Services resource.
* Each tag has a key and an optional value, both of which are defined by you. 
* In AWS Glue, you may use tags to organize and identify your resources.
* Tags can be used to generate cost accounting reports and limit resource access.
* You can restrict which users in your AWS account have authority to create, update, or delete tags if you use AWS Identity and Access Management.

**The following AWS Glue resources can be tagged:**
- Crawler
- Job
- Trigger
- Workflow
- Development endpoint
- Machine learning transform

# What are the points to remember when using tags with AWS Glue?
- Each entity can have a maximum of 50 tags.
- Tags are specified as a list of key-value pairs in the "string": "string"... in AWS Glue.
- The tag key is necessary when creating a tag on an item, but the tag value is not.
- Case matters when it comes to the tag key and value.
- The prefix AWS cannot be used in the tag key or the tag value. Such tags are not subject to any activities.
- In UTF-8, 128 Unicode characters are the maximum tag key length. There can't be any empty or null tags in the tag key.
- In UTF-8, 256 Unicode characters are the highest tag value length. The tag value may be null or empty.

# What is the AWS Glue database?
* The AWS Glue Data Catalog database is a container that houses tables.
* You utilize databases to categorize your tables. When you run a crawler or manually add a table, you establish a database.
* All of your databases are listed in the AWS Glue console's database list.

# What programming language is used to write ETL code for AWS Glue?
* Scala or Python can write ETL code for AWS Glue.

# What is the AWS Glue Job system?
* AWS Glue Jobs is a managed platform for orchestrating your ETL workflow.
* In AWS Glue, you may construct jobs to automate the scripts you use to extract, transform, and transport data to various places.
* Jobs can be scheduled and chained, or events like new data arrival can trigger them.

# Does AWS Glue use EMR?
* The AWS Glue Data Catalog integrates with Amazon EMR, Amazon RDS, Amazon Redshift, Redshift Spectrum, Athena, and any application compatible with the Apache Hive megastore, providing a consistent metadata repository across several data sources and data formats.

# Does AWS Glue have a no-code interface for visual ETL?
* Yes. AWS Glue Studio is a graphical tool for creating Glue jobs that process data.
* AWS Glue studio will produce Apache Spark code on your behalf once you've defined the flow of your data sources, transformations, and targets in the visual interface.

# How do I query metadata in Athena?
* AWS Glue metadata such as databases, tables, partitions, and columns may be queried using Athena.
* Individual hive DDL commands can be used to extract metadata information from Athena for specific databases, tables, views, partitions, and columns, but the results are not tabular.

# What is the general workflow for how a Crawler populates the AWS Glue Data Catalog?
**The usual method for populating the AWS Glue Data Catalog via a crawler is as follows:**
- To deduce the format and schema of your data, a crawler runs any custom classifiers you specify. Custom classifiers are programmed by you and run in the order you specify.
- A schema is created using the first custom classifier that correctly recognizes your data structure. Lower-ranking custom classifiers are ignored.
- Built-in classifiers attempt to identify your data schema if no custom classifier matches it. One that acknowledges JSON is an example of a built-in classifier.
- The crawler accesses the data storage. Connection attributes are required for crawler access to some data repositories.
- Your data will be given an inferred schema.
- The crawler populates the data catalog. A table description is a piece of metadata that defines your data store's data. The table is kept in the Data Catalog, a database container for tables. The label generated by the classifier that inferred the table schema is the table's classification attribute.

# How to customize the ETL code generated by AWS Glue?
* Scala or Python code is generated via the AWS Glue ETL script suggestion engine.
* It makes use of Glue's ETL framework to manage task execution and facilitate access to data sources.
* One can use AWS Glue's library to write ETL code, or you can use inline editing using the AWS Glue Console script editor to write arbitrary code in Scala or Python, which you can then download and modify in your IDE.

# How to build an end-to-end ETL workflow using multiple jobs in AWS Glue?
* AWS Glue includes a sophisticated set of orchestration features that allow you to handle dependencies between numerous tasks to design end-to-end ETL processes; in addition to the ETL library and code generation, AWS Glue ETL jobs can be scheduled or triggered when they finish.
* Several jobs can be activated simultaneously or sequentially by triggering them on a task completion event.

# How does AWS Glue monitor dependencies?
* AWS Glue uses triggers to handle dependencies among two or more activities or external events.
* Triggers can both watch and invoke jobs. The three options are a scheduled trigger, which runs jobs regularly, an on-demand trigger, or a job completion trigger.

# How does AWS Glue handle ETL errors?
* AWS Glue tracks job metrics and faults and sends all alerts to Amazon CloudWatch.
* You may set up Amazon CloudWatch to do various tasks responding to AWS Glue notifications.
* You can use AWS Lambda to trigger an AWS Lambda function when you get an error or a success notice from Glue.
* Glue also has a default retry behavior that retries all errors three times before generating an error message.

# Can we run existing ETL jobs with AWS Glue?
* Yes. On AWS Glue, we can run your Scala or Python code.
* Simply save the code to Amazon S3 and use it in one or more jobs.
* We can reuse code across multiple jobs by connecting numerous jobs to the exact code location on Amazon S3.

# What AWS Glue Schema Registry supports data format, client language, and integrations?
* The Schema Registry supports Java client apps and Apache Avro and JSON Schema data formats.
* We intend to keep adding support for non-Java clients and various data types.
* The Schema Registry works with Apache Kafka, Amazon Managed Streaming for Apache Kafka (MSK), Amazon Kinesis Data Streams, Apache Flink, Amazon Kinesis Data Analytics for Apache Flink, and AWS Lambda applications.

# How to get metadata into the AWS Glue Data Catalog?
* The AWS Glue Data Catalog can be populated in a variety of ways.
* Crawlers in the Glue Data Catalog search various data stores you own to infer schemas and partition structure and populate the Glue Data Catalog with table definitions and statistics.
* You can also run crawlers regularly to keep your metadata current and in line with the underlying data.
* Users can also use the AWS Glue Console or the API to manually add and change table information.
* Hive DDL statements can also be executed on an Amazon EMR cluster via the Amazon Athena Console or a Hive client.

# How to import data from the existing Apache Hive Metastore to the AWS Glue Data Catalog?
* Simply execute an ETL process that reads data from your Apache Hive Metastore, exports it to Amazon S3, and imports it into the AWS Glue Data Catalog.

# Do we need to maintain my Apache Hive Metastore if we store metadata in the AWS Glue Data Catalog?
* No, the Apache Hive Metastore is incompatible with AWS Glue Data Catalog.
* You can use Glue Data Catalog to replace Apache Hive Metastore by pointing to its endpoint.

# When should we use AWS Glue Streaming, and when should I use Amazon Kinesis Data Analytics?
* Streaming data can be processed with AWS Glue and Amazon Kinesis Data Analytics.
* AWS Glue is advised when your use cases are mostly ETL, and you wish to run tasks on a serverless Apache Spark-based infrastructure.
* Amazon Kinesis Data Analytics is recommended when your use cases are mostly analytics, and you want to run jobs on a serverless Apache Flink-based platform.
* AWS Glue's Streaming ETL allows you to perform complex ETL on streaming data using the same serverless, pay-as-you-go infrastructure that you use for batch tasks.
* AWS Glue provides customized ETL code to prepare your data in flight and has built-in functionality to process semi-structured or developing schema Streaming data.
* Use Glue to load data streams into your data lake or warehouse using its built-in and Spark-native transformations.
* We can use Amazon Kinesis Data Analytics to create complex streaming applications that analyze data in real time.
* It offers a serverless Apache Flink runtime that scales without servers and saves application information indefinitely.
* For real-time analytics and more generic stream data processing, use Amazon Kinesis Data Analytics.

# What is AWS Glue DataBrew?
* AWS Glue DataBrew is a visual data preparation solution that allows data analysts and scientists to prepare without writing code using an interactive, point-and-click graphical interface.
* You can simply visualize, clean, and normalize terabytes, even petabytes, of data directly from your data lake, data warehouses, and databases, including Amazon S3, Amazon Redshift, Amazon Aurora, and Amazon RDS, with Glue DataBrew.

# Who can use AWS Glue DataBrew?
* AWS Glue DataBrew is designed for users that need to clean and standardize data before using it for analytics or machine learning.
* The most common users are data analysts and data scientists.
* Business intelligence analysts, operations analysts, market intelligence analysts, legal analysts, financial analysts, economists, quants, and accountants are examples of employment functions for data analysts.
* Materials scientists, bioanalytical scientists, and scientific researchers are all examples of employment functions for data scientists.

# What types of transformations are supported in AWS Glue DataBrew?
* You can combine, pivot, and transpose data using over 250 built-in transformations without writing code.
* AWS Glue DataBrew also suggests transformations such as filtering anomalies, rectifying erroneous, wrongly classified, duplicate data, normalizing data to standard date and time values, or generating aggregates for analysis automatically.
* Glue DataBrew enables transformations that leverage powerful machine learning techniques such as Natural Language Processing for complex transformations like translating words to a common base or root word (NLP).
* Multiple transformations can be grouped, saved as recipes, and applied straight to incoming data.

# What file formats does AWS Glue DataBrew support?
* AWS Glue DataBrew accepts comma-separated values (.csv), JSON and nested JSON, Apache Parquet and nested Apache Parquet, and Excel sheets as input data types.
* Comma-separated values (.csv), JSON, Apache Parquet, Apache Avro, Apache ORC, and XML are all supported as output data formats in AWS Glue DataBrew.

# Do we need to use AWS Glue Data Catalog or AWS Lake Formation to use AWS Glue DataBrew?
* No. Without using the AWS Glue Data Catalog or AWS Lake Formation, you can use AWS Glue DataBrew.
* DataBrew users can pick data sets from their centralized data catalog using the AWS Glue Data Catalog or AWS Lake Formation.

# What is AWS Glue Elastic Views?
* AWS Glue Elastic Views makes it simple to create materialized views that integrate and replicate data across various data stores without writing proprietary code.
* AWS Glue Elastic Views can quickly generate a virtual materialized view table from multiple source data stores using familiar Structured Query Language (SQL).
* AWS Glue Elastic Views moves data from each source data store to a destination datastore and generates a duplicate of it.
* AWS Glue Elastic Views continuously monitors data in your source data stores, and automatically updates materialized views in your target data stores, ensuring that data accessed through the materialized view is always up-to-date.

# Why should we use AWS Glue Elastic Views?
* Use AWS Glue Elastic Views to aggregate and continuously replicate data across several data stores in near-real-time.
* This is frequently the case when implementing new application functionality requiring data access from one or more existing data stores.
* For example, a company might use a customer relationship management (CRM) application to keep track of customer information and an e-commerce website to handle online transactions.
* The data would be stored in these apps or more data stores.
* The firm is now developing a new custom application that produces and displays special offers for active website visitors.

# What is AWS Glue?
* AWS Glue helps in preparing data for Analysis by automated extract, transforming, and loading ETL processes.
* It supports MySQL, Microsoft SQL Server, PostgreSQL Databases which runs on Amazon EC2(Elastic Compute Cloud) Instances in an Amazon VPC(Virtual Private Cloud).
* AWS Glue is an extracted, loaded, transformed service which helps in automating time-consuming steps of Data Preparation for the analytics.

# What are the Benefits of AWS Glue?
**Benefits of AWS Glue are as follows:**
- **Fault Tolerance** - AWS Glue is retrievable and the logs can be debugged.
- **Filtering** - AWS Glue uses filtering for bad data.
- **Maintenance and Development** - AWS Glue uses maintenance and deployment as the service is managed by AWS.

# What are the components used by AWS Glue?
**AWS Glue consists of:**
- Data Catalog is a Central Metadata Repository.
- ETL Engine helps in generating Python and Scala Code.
- Flexible Scheduler helps in handling Dependency Resolution, Job Monitoring and Retring.
- AWS Glue DataBrew helps in Normalizing and Cleaning Data with visual interface.
- AWS Glue Elastic View used in Replicating and Combining Data through multiple Data Stores.

# What Data Sources are supported by AWS Glue?
**Data Sources supported by AWS Glue are:**
- Amazon Aurora
- Amazon RDS for MySQL
- Amazon RDS for Oracle
- Amazon RDS for PostgreSQL
- Amazon RDS for SQL Server
- Amazon Redshift
- DynamoDB
- Amazon S3
- MySQL
- Oracle
- Microsoft SQL Server

**AWS Glue also supports Database such as:**
- Amazon MSK
- Amazon Kinesis Data Streams
- Apache Kafka

# What are Development Endpoints?
* Development Endpoints are used in describing the AWS Glue API that is related to testing by using Custom DevEndpoint.
* The endpoint is where a developer can debug the extract, transforming, and loading ETL Scripts.

# What are AWS Tags in AWS Glue?
* AWS Tags are labels used in assigning us to AWS Resources.
* Each tag contains a Key and an Optional Value, which we can define.
* We can also use tags in AWS Glue for organizing and identifying our resources.
* All the tags are used in creating cost accounting reports and restricting access to resources.

# What is AWS Glue Data Catalog?
* AWS Glue Data Catalog helps by storing Structural and Operational Metadata for all the Data Assets.
* It also helps in providing uniform repositories where the disparate systems help in storing and finding metadata for keeping track of data in Data Silos and also in using metadata to query and in transforming the data.
* AWS Glue Data Catalog also helps in storing Table Definition, Physical Location, and Business relevant Attributes, also tracks data that has changed over time.

# What are AWS Glue Crawlers?
* AWS Glue Crawler helps in connecting Data Store, also progress by a prioritized list of classifiers for extracting the schema of the data and other statistics.
* AWS Glue Crawler also helps by scanning data stores to automatically infer schemas and the partition structures for populating Glue Data Catalog with Table definitions and statistics.

# What is AWS Glue Streaming ETL?
* AWS Glue is used in enabling ETL Operations on the streaming data by using continuously running jobs.
* Streaming ETL is built on Apache Spark that is structured in streaming engines and in ingesting streams from Kinesis Data Streams and Kafka by using Amazon Managed Streaming for Apache Kafka.

# Is AWS Glue Schema Registry open-source?
* AWS Glue Schema Registry Storage is a service used while serializing and deserializing Apache Licensed open sources components.

# How can we list Databases and Tables in AWS Glue Catalog?
**We can list Databases and Tables by using the following command:**
```glue
import boto3
client = boto3.client('glue',region_name='us-east-1')

responseGetDatabases = client.get_databases()

databaseList = responseGetDatabases['DLIST']

for databaseDict in databaseList:

    databaseName = databaseDict['XYZ']
    print '\ndatabaseXYZ: ' + databaseXYZ

    responseGetTables = client.get_tables( DatabaseName = databaseDEF )
    tableList = responseGetTables['TLIST']

    for tableDict in tableList:

         tableName = tableDict['ABC']
         print '\n-- tableABC: '+tableABC
```

# How does AWS Glue update Duplicating Data?
**AWS Glue update Duplicating Data by using the following command:**
```glue
sc = SparkContext()
glueContext = GlueContext(sc)

#get your source data
src_data = create_dynamic_frame.from_catalog(database = src_fg,
 table_name = src_fg)
src_df =  src_data.toDF()


#get your destination data
dst_data = create_dynamic_frame.from_catalog(database = dst_fg,
 table_name = dst_fg)
dst_df =  dst_data.toDF()

#Now merge two data frames to remove duplicates
merged_df = dst_df.union(src_df)

#Savea the data to destination with OVERWRITE MODE
merged_df.write.format('abcd').
```

# What is AWS Glue?
* AWS Glue is a fully managed data ingestion and transformation service.
* You can build simple and cost-effective solutions to clean and process the data flowing through your various systems using AWS Glue.
* You can think of AWS Glue as a modern ETL alternative.

# Describe the AWS Glue Architecture
* The main components of AWS Glue architecture are:
    - AWS Glue Catalog
    - Glue Crawlers, Classifiers, and Connections
    - Glue job

# What are the primary benefits of using AWS Data Brew?
* AWS Data Brew is a visual data preparation service that simplifies the process of data cleansing & transformation.

**The primary benefits of using AWS Data Brew are:**
- **Visual interface:** Data Brew provides an intuitive visual interface for configuring data preparation workflows, making it easy for users with limited technical skills to use the service.
- *Automated data preparation:* Data Brew can automatically detect patterns in your source data and suggest actions to cleanse it, reducing the data preparation effort significantly.
- **Increased efficiency:** The visual interface, detection of patterns, and cleansing actions together significantly reduce the time spent on data preparation, improving efficiency.
- **Integration with other AWS services:** Data Brew integrates natively with many other AWS services, including Amazon S3, RDS, and Redshift, making it easy to source and prepare data from those data sources for analysis or use in other applications.
- **Flexible, pay-per-use pricing model:** Like most AWS Services, with Data Brew, you only pay for what you use, making it a cost-effective solution for data preparation that can scale with your needs.

# Describe the four ways to create AWS Glue jobs
**Four ways to create Glue jobs are:**
* **Visual Canvas:** An intuitive, drag-and-drop interface that makes it super easy to create Glue jobs without writing any code.
* **Spark script:** Create Glue jobs using Spark code in Scala or PySpark, providing access to the full Spark ecosystem to create complex data transformations.
* **Python script:** AWS Glue supports Python scripts, useful for scenarios requiring a high degree of versatility and custom logic.
* **Jupyter Notebook:** An interactive environment to create and run data transformations and then convert them into Glue jobs, best suited for collaborative work and iterative development of data transformations.

# How does AWS Glue support the creation of no-code ETL jobs?
* AWS Glue supports the creation of no-code ETL jobs through its Visual Canvas – a drag-and-drop interface to create AWS Glue jobs without writing any code.
* Visual Canvas allows users to visually define sources, targets, and data transformations by connecting sources to targets.
* Visual Canvas comes with a library of pre-built transformations, making it possible to create and deploy Glue jobs quickly and easily, even for users with limited technical skills.
* Additionally, Visual Canvas integrates natively with other AWS services, such as S3, RDS, and Redshift, making it easy to move data between these purpose-built data stores.

# What is a connection in AWS Glue?
* A connection in AWS Glue stores information required to connect to a data source such as Redshift, RDS, DynamoDB, or S3. Connections, with the help of glue crawlers, help move data from source to target.
* In addition to the support for many AWS native data stores, glue connections also support external data sources as long as those data sources can be connected to using a JDBC driver.

# What is the best practice for managing the credentials required by a Glue connection?
* The best practice is for the credentials to be stored and accessed securely by leveraging AWS Systems Manager (SSM), AWS Secrets Manager, or Amazon Key Management Service (KMS).

# What streaming sources does AWS Glue support?
* AWS Glue supports Amazon Kinesis Data Streams, Apache Kafka, and Amazon Managed Streaming for Apache Kafka (Amazon MSK).

# What is an interactive session in AWS Glue and what are its benefits?
* Interactive sessions in AWS Glue are on-demand serverless Spark runtime environments that allow rapid build and test of data preparation and analytics applications.
* Interactive sessions can be used via the visual interface, AWS command line, or the API.
* Using interactive sessions, you can author and test your scripts as Jupyter notebooks.
* Glue supports a comprehensive set of Jupyter magics allowing developers to develop rich data preparation or transformation scripts.

# What are the two types of workflow views in AWS Glue?
* The two types of workflow views are static views and dynamic views.
* Static view can be considered as the design view of the workflow, whereas the dynamic view is the runtime view of the workflow that includes logs, status, and error details for the latest run of the workflow.
* Static view is used mainly while defining the workflow, whereas dynamic view is used when operating the workflow.

# What are start triggers in AWS Glue?
* Start triggers are special Data Catalog objects that can be used to start Glue jobs.
* Start triggers in AWS Glue can be one of three types: Scheduled, Conditional, or On-demand.

# How can you start an AWS Glue workflow run using AWS CLI?
* AWS Glue workflow can be started using the `start-workflow-run` command of AWS CLI and passing the workflow name as a parameter.
* The command accepts various optional parameters which are listed in the [AWS CLI documentation](https://docs.aws.amazon.com/cli/latest/reference/glue/start-workflow-run.html).

# What role does Apache Spark play in AWS Glue?
* AWS Glue and Apache Spark are closely intertwined. At its core, AWS Glue leverages Apache Spark as its underlying distributed data processing engine.
* Apache Spark plays a pivotal role in AWS Glue, empowering it with robust data processing capabilities.
* AWS Glue uses Apache Spark as a distributed data processing engine.
* AWS Glue scripts are compiled into code that runs on Apache Spark.
* SparkContext, a key component in Spark, is initialized implicitly in AWS Glue so you don’t have to worry about initializing it yourself.

# Explain why and when you would use AWS Glue compared to other options to set up data pipelines
* AWS Glue makes it easy to move data between data stores and can be used in a variety of data integration scenarios, including:
    - Data lake build & consolidation
    - Data migration
    - Data transformation
    - Data cataloging
* When compared to other options for setting up data pipelines, such as Apache NiFi or Apache Airflow, AWS Glue is typically a good choice if:
    - You want a fully managed solution
    - Your data sources are primarily in AWS
    - You are constrained by programming skills     availability
    - You need flexibility and scalability

# Can you highlight the role of AWS Glue in big data environments?
* AWS Glue plays a pivotal role in big data environments as it provides the ability to handle, process, and transform large data sets in distributed and parallel environments.
* AWS Glue is engineered for large-scale data processing.
* It can scale horizontally, providing the capability to process petabytes of data efficiently and quickly.
* AWS Glue is highly beneficial in a big data environment due to its serverless architecture and integration capabilities with other AWS services.

## What is the difference between AWS Glue and AWS EMR?
**Some of the differences between AWS Glue and EMR are:**
- AWS Glue is a fully managed ETL (extract, transform, and load) service, while AWS EMR is a service that makes it easy to process large amounts of data quickly and efficiently.
- AWS Glue can be easily used to process both structured as well as unstructured data, while AWS EMR is typically suited for processing structured or semi-structured data.
- AWS Glue can automatically discover and categorize the data, while AWS EMR does not have that capability.

# What are some ways to orchestrate glue jobs as part of a larger ETL flow?
* Glue Workflows and AWS Step Functions are two ways to orchestrate glue jobs as part of large ETL flows.

# Can Glue crawlers be configured to run on a regular schedule? If yes, how?
* Yes, Glue crawlers can be configured to run on a regular schedule.
* Glue supports cron based scheduling format to be specified during the creation of the crawler.
* For ETL workflows orchestrated by step functions, event-based triggers in step functions can be used to run crawlers on a specific schedule.

# Is AWS Glue suitable for converting log files into structured data?
* Yes, AWS Glue is suitable for converting log files into structured data.
* Using the AWS Glue Visual Canvas or by defining a custom glue job, we can define custom data transformations to structure log file data.

# How can you pull data from an external API in your AWS Glue job?
* AWS Glue does not have native support for connecting to external APIs.
* To allow AWS Glue to access data from an external API, we can build a custom connector in Amazon AppFlow that connects to the external API, retrieves the necessary data, and makes it available to AWS Glue.

# Our company’s spend on AWS Glue is increasing rapidly. How can we optimize our AWS Glue spend?
* Cost optimization is a critical aspect of running workloads in the cloud and leveraging cloud services, including AWS Glue.
* When optimizing AWS Glue spend, factors such as using Glue Development Endpoints sparingly, choosing the right DPU allocation, optimizing job concurrency, and using Glue job bookmarks to track processed data should be considered.

# What is the difference between Glue Data Catalog and Collibra Data Catalog?
* AWS Glue Data Catalog is a centralized metadata repository primarily focused on seamless integration with AWS services, while Collibra Data Catalog emphasizes comprehensive data governance, collaboration, and data quality management.

# How does AWS Glue Schema Registry work?
* AWS Glue Schema Registry is a serverless feature that makes it easy to discover, control, and evolve data stream schemas.
* It allows you to validate and control the evolution of streaming data using registered Apache Avro schemas, thus ensuring data produced and consumed by different applications is compatible and can be parsed reliably.

# How does AWS Glue integrate with AWS Sagemaker?
* AWS Glue can prepare and load data into data stores for analytics.
* One such destination can be AWS Sagemaker, where we can train machine learning models on the prepared data.
* AWS Glue can pull data from various sources, clean and transform it, and then AWS Sagemaker can use this data for machine learning purposes.

# Scenario: You are working on a project where you need to clean and prepare large amounts of raw data for analysis. The data is stored in various formats and in different AWS services like Amazon S3, Amazon RDS, and Amazon Redshift. How would you use AWS Glue in this scenario to automate the process of data preparation?
* AWS Glue is a fully managed extract, transform, and load (ETL) service that makes it easy to prepare and load data for analysis.
* I would use AWS Glue to discover the data and store the associated metadata (e.g., table definition and schema) in the AWS Glue Data Catalog. Once cataloged in Glue Catalog, the data is immediately searchable, queryable, and available for ETL.
* AWS Glue generates Python or Scala code for the transformations, which I can further customize if needed.

# Scenario: Your company has a large amount of data stored in a non-relational database on AWS, and you need to move this data to a relational database for a specific analysis. The data needs to be transformed during this process. How would you use AWS Glue for this data migration and transformation?
* AWS Glue can connect to on-premises and cloud-based data sources, including non-relational databases.
* I would use AWS Glue to extract the data from the non-relational database, transform the data to match the schema of the relational database, and then load the transformed data into the relational database.
* The transformation could include actions like converting data formats, mapping one data set to another, and cleaning data.

# Scenario: You are tasked with setting up a data catalog for your organization. The data is stored in various AWS services and in different formats. How would you use AWS Glue to create a centralized metadata repository?
* In this scenario, I would use AWS Glue’s data crawlers to automatically discover and catalog metadata from various data sources in AWS.
* The cataloged metadata, stored in the AWS Glue Data Catalog, includes data format, data type, and other characteristics.
* This makes the data easily searchable and queryable across the organization.
* The Data Catalog integrates with other AWS services like Amazon Athena and Amazon Redshift Spectrum, allowing direct querying of the data without moving it.
* Additionally, it stores metadata related to ETL jobs, aiding in automating data preparation for analysis.
* This approach creates a unified view of all data, irrespective of its location or format.

# Define and explain the three basic types of cloud services and the AWS products that are built based on them?
- **Computing:** AWS products include EC2, Elastic Beanstalk, Lambda, Auto-Scaling, and Lightsat.
- **Storage:** AWS products include S3, Glacier, Elastic Block Storage, and Elastic File System.
- **Networking:** AWS products include VPC, Amazon CloudFront, and Route53.

# What is the relation between the Availability Zone and Region?
- AWS regions are separate geographical areas (e.g., US-West 1, Asia South) and availability zones are isolated zones inside regions that can replicate themselves.

# What is auto-scaling?
- Auto-scaling allows you to provision and launch new instances automatically based on demand, increasing or decreasing resource capacity.

# What is geo-targeting in CloudFront?
- Geo-targeting allows businesses to show personalized content based on geographic location without changing the URL, creating customized content for specific geographical areas.

# What are the steps involved in a CloudFormation Solution?
- Create or use an existing CloudFormation template using JSON or YAML format.
- Save the code in an S3 bucket.
- Use AWS CloudFormation to create a stack on your template, which reads the file and provisions the services.

# How do you upgrade or downgrade a system with near-zero downtime?
- Launch an instance with the new instance type, install updates and applications, test it, and replace the older instance once it's working.

# What are the tools and techniques to identify and correct overpayments in AWS?
- Check the Top Services Table, use Cost Explorer, set up AWS Budgets, and use Cost Allocation Tags.

# Is there an alternative tool to log into the cloud environment other than the console?
- Yes, tools like Putty, AWS CLI for Linux/Windows, AWS SDK, and Eclipse can be used.

# What services can be used to create a centralized logging solution?
- Amazon CloudWatch Logs, Amazon S3, and Amazon ElasticSearch can be used to create a centralized logging solution.

# What are the native AWS Security logging capabilities?
- AWS CloudTrail provides history of AWS API calls and can be configured to send notifications via AWS SNS.
- AWS Config helps understand configuration changes and can also send information via AWS SNS.

# What is a DDoS attack, and what services can minimize them?
* DDoS is a cyber-attack in which the perpetrator accesses a website and creates multiple sessions so that the other legitimate users cannot access the service.
* The native tools that can help you deny the DDoS attacks on your AWS services are:
    - AWS Shield
    - AWS WAF
    - Amazon Route53
    - Amazon CloudFront
    - ELB
    - VPC

# You are trying to provide a service in a particular region, but you do not see the service in that region. Why is this happening, and how do you fix it?
* Not all Amazon AWS services are available in all regions. When Amazon initially launches a new service, it doesn’t get immediately published in all the regions. They start small and then slowly expand to other regions.
* So, if you don’t see a specific service in your region, chances are the service hasn’t been published in your region yet.
* However, if you want to get the service that is not available, you can switch to the nearest region that provides the services.

# How do you set up a system to monitor website metrics in real-time in AWS?
* Amazon CloudWatch helps you to monitor the application status of various AWS services and custom events.

**It helps you to monitor:**
- State changes in Amazon EC2
- Auto-scaling lifecycle events
- Scheduled events
- AWS API calls
- Console sign-in events

# What are the different types of virtualization in AWS, and what are the differences between them?
* The three major types of virtualization in AWS are:
    - Hardware Virtual Machine (HVM)
    - Paravirtualization (PV)
    - Paravirtualization on HVM

# Name some of the AWS services that are not region-specific
* AWS services that are not region-specific are:
    - IAM
    - Route 53
    - Web Application Firewall 
    - CloudFront

# What are the differences between NAT Gateways and NAT Instances?
**While both NAT Gateways and NAT Instances serve the same function, they still have some key differences:**
- **NAT Gateway:**
    - Availability: High
    - Bandwidth: Up to 45 Gbps
    - Maintenance: Managed by AWS
    - Performance: Very Good
    - Cost: Number of gateways, duration and amount of usage
    - Size and load: Uniform
    - Security Groups: Cannot be assigned
- **NAT Instance:**
    - Availability: High
    - Bandwidth: Depends on instance bandwidth
    - Maintenance: Managed by you
    - Performance: Average
    - Cost: Number of instances, duration, amount and type of usage
    - Size and load: As per your need
    - Security Groups: Can be assigned

# What is CloudWatch?
**The Amazon CloudWatch has the following features:**
- Depending on multiple metrics, it participates in triggering alarms.
- Helps in monitoring the AWS environments like CPU utilization, EC2, Amazon RDS instances, Amazon SQS, S3, Load Balancer, SNS, etc.

# What is an Elastic Transcoder?
* To support multiple devices with various resolutions like laptops, tablets, and smartphones, we need to change the resolution and format of the video.
* This can be done easily by an AWS Service tool called the Elastic Transcoder, which is a media transcoding in the cloud that exactly lets us do the needful.
* It is easy to use, cost-effective, and highly scalable for businesses and developers.

# With specified private IP addresses, can an Amazon Elastic Compute Cloud (EC2) instance be launched? If so, which Amazon service makes it possible?
* Yes, it is possible to launch an EC2 instance with specified private IP addresses using the Virtual Private Cloud (VPC) service.

# Define Amazon EC2 regions and availability zones?
* Availability zones are geographically separate locations.
* As a result, failure in one zone has no effect on EC2 instances in other zones.
* When it comes to regions, they may have one or more availability zones.
* This configuration also helps to reduce latency and costs.

# Explain Amazon EC2 root device volume?
* The image that will be used to boot an EC2 instance is stored on the root device drive.
* This occurs when an Amazon AMI runs a new EC2 instance. And this root device volume is supported by EBS or an instance store.
* In general, the root device data on Amazon EBS is not affected by the lifespan of an EC2 instance.

# Mention the different types of instances in Amazon EC2 and explain their features.
- **General Purpose Instances:** They are used to compute a range of workloads and aid in the allocation of processing, memory, and networking resources.
- **Compute Optimized Instances:** These are ideal for compute-intensive applications. They can handle batch processing workloads, high-performance web servers, machine learning inference, and various other tasks.
- **Memory Optimized Instances:** They process workloads that handle massive datasets in memory and deliver them quickly.
- **Accelerated Computing Instances:** It aids in the execution of floating-point number calculations, data pattern matching, and graphics processing. These functions are carried out using hardware accelerators.
- **Storage Optimized Instances:** They handle tasks that require sequential read and write access to big data sets on local storage.

# Will your standby RDS be launched in the same availability zone as your primary?
* No, standby instances are launched in different availability zones than the primary, resulting in physically separate infrastructures.
* This is because the entire purpose of standby instances is to prevent infrastructure failure.
* As a result, if the primary instance fails, the backup instance will assist in recovering all of the data.

# What is the difference between a Spot Instance, an On-demand Instance, and a Reserved Instance?
- **Spot Instance:** These are unused EC2 instances that users can use at a reduced cost.
- **On-demand Instance:** When you use on-demand instances, you must pay for computing resources without making long-term obligations.
- **Reserved Instance:** Reserved instances allow you to specify attributes such as instance type, platform, tenancy, region, and availability zone. Reserved instances offer significant reductions and capacity reservations when instances in certain availability zones are used.

# How would you address a situation in which the relational database engine frequently collapses when traffic to your RDS instances increases, given that the RDS instance replica is not promoted as the master instance?
* You would need to upgrade to a larger RDS instance type to handle the increased traffic, as well as set up manual or automated snapshots to recover data in case the RDS instance fails.

# What do you understand by 'changing' in Amazon EC2?
* 'Changing' in Amazon EC2 refers to the ability to switch from the current 'instance count-based limitations' to the new 'vCPU Based restrictions.' This change makes it easier for customers to manage limits when launching a combination of instance types based on demand, with utilization measured in terms of the number of vCPUs.

# Define Snapshots in Amazon Lightsail?
* Snapshots in Amazon Lightsail are point-in-time backups of EC2 instances, block storage drives, and databases.
* They can be created manually or automatically at any time.
* Snapshots allow you to restore your resources to a previous state, even after they have been deleted, and perform the same tasks as the original resources.

# On an EC2 instance, an application of yours is active. Once the CPU usage on your instance hits 80%, you must reduce the load on it. What strategy do you use to complete the task?
* You can accomplish this by setting up an autoscaling group to deploy additional instances when an EC2 instance's CPU usage exceeds 80%, and by distributing traffic across instances by creating an application load balancer and designating EC2 instances as target instances.

# Multiple Linux Amazon EC2 instances running a web application for a firm are being used, and data is being stored on Amazon EBS volumes. The business is searching for a way to provide storage that complies with atomicity, consistency, isolation, and durability while also increasing the application's resilience in the event of a breakdown (ACID). What steps should a solutions architect take to fulfill these demands?
* The solutions architect should use AWS Auto Scaling groups to create an application load balancer that spans multiple availability zones.
* They should then mount a target on each instance and store data on Amazon EFS.

# Your business prefers to use its email address and domain to send and receive compliance emails. What service do you recommend to implement it easily and budget-friendly?
* This can be accomplished by using Amazon Simple Email Service (Amazon SES), a cloud-based email-sending service.

# Describe SES.
* Amazon offers the Simple Email Service (SES) service, which allows you to send bulk emails to customers swiftly at a minimal cost.

# Describe PaaS.
* PaaS supports the operation of multiple cloud platforms, primarily for the development, testing, and oversight of the operation of the program.

# How many S3 buckets can be created?
* Up to 100 buckets can be created by default.

# What is the maximum limit of elastic IPs anyone can produce?
* A maximum of five elastic IP addresses can be generated per location and AWS account.

# What is Amazon EC2?
* EC2 is short for Elastic Compute Cloud, and it provides scalable computing capacity.
* Using Amazon EC2 eliminates the need to invest in hardware, leading to faster development and deployment of applications.
* You can use Amazon EC2 to launch as many or as few virtual servers as needed, configure security and networking, and manage storage.
* It can scale up or down to handle changes in requirements, reducing the need to forecast traffic.
* EC2 provides virtual computing environments called “instances.”

# What Are Some of the Security Best Practices for Amazon EC2?
* Security best practices for Amazon EC2 include using Identity and Access Management (IAM) to control access to AWS resources; restricting access by only allowing trusted hosts or networks to access ports on an instance; only opening up those permissions you require, and disabling password-based logins for instances launched from your AMI.

# Can S3 Be Used with EC2 Instances, and If Yes, How?
* Amazon S3 can be used for instances with root devices backed by local instance storage.
* That way, developers have access to the same highly scalable, reliable, fast, inexpensive data storage infrastructure that Amazon uses to run its own global network of websites.
* To execute systems in the Amazon EC2 environment, developers load Amazon Machine Images (AMIs) into Amazon S3 and then move them between Amazon S3 and Amazon EC2.
* Amazon EC2 and Amazon S3 are two of the best-known web services that make up AWS.

# What is the difference between stopping and terminating an EC2 instance?
* While you may think that both stopping and terminating are the same, there is a difference.
* When you stop an EC2 instance, it performs a normal shutdown on the instance and moves to a stopped state.
* However, when you terminate the instance, it is transferred to a stopped state, and the EBS volumes attached to it are deleted and can never be recovered.

# What are the different types of EC2 instances based on their costs?
**The three types of EC2 instances are:**
- **On-demand Instance:** It is cheap for a short time but not when taken for the long term.
- **Spot Instance:** It is less expensive than the on-demand instance and can be bought through bidding.
- **Reserved Instance:** If you are planning to use an instance for a year or more, then this is the right one for you.

# How do you set up SSH agent forwarding so that you do not have to copy the key every time you log in?
* Here’s how you accomplish this:
    * Go to your PuTTY Configuration.
    * Go to the category SSH -> Auth.
    * Enable SSH agent forwarding to your instance.

# What are Solaris and AIX operating systems? Are they available with AWS?
* Solaris is an operating system that uses SPARC processor architecture, which is not supported by the public cloud currently.
* AIX is an operating system that runs only on Power CPU and not on Intel, which means that you cannot create AIX instances in EC2.
* Since both the operating systems have their limitations, they are not currently available with AWS.

# How do you configure CloudWatch to recover an EC2 instance?
* Here’s how you can configure them:
    * Create an Alarm using Amazon CloudWatch
    * In the Alarm, go to Define Alarm -> Actions tab
    * Choose Recover this instance option

# What are the common types of AMI designs?
* There are many types of AMIs, but some of the common AMIs are:
    - Fully Baked AMI
    - Just Enough Baked AMI (JeOS AMI)
    - Hybrid AMI

# What are Key-Pairs in AWS?
* The Key-Pairs are password-protected login credentials for the Virtual Machines that are used to prove our identity while connecting the Amazon EC2 instances.
* The Key-Pairs are made up of a Private Key and a Public Key which lets us connect to the instances.

# What is Amazon S3? 
* S3 is short for Simple Storage Service, and Amazon S3 is the most supported storage platform available.
* S3 is object storage that can store and retrieve any amount of data from anywhere.
* Despite that versatility, it is practically unlimited as well as cost-effective because it is storage available on demand.
* In addition to these benefits, it offers unprecedented levels of durability and availability.
* Amazon S3 helps to manage data for cost optimization, access control, and compliance. 

# How can you recover/login to an EC2 instance for which you have lost the key?
* Follow the steps provided below to recover an EC2 instance if you have lost the key:
    * Verify that the EC2Config service is running
    * Detach the root volume for the instance
    * Attach the volume to a temporary instance
    * Modify the configuration file
    * Restart the original instance

# What are some critical differences between AWS S3 and EBS?
| Feature | AWS S3 | AWS EBS |
|---|---|---|
| Paradigm | Object Store | Filesystem |
| Performance | Fast | Superfast |
| Redundancy | Across data centers | Within a data center |
| Security | Using public or private key | Can be used only with EC2 |

# How do you allow a user to gain access to a specific bucket?
* You need to follow the four steps provided below to allow access.

**They are:**
- Categorize your instances
- Define how authorized users can manage specific servers.
- Lockdown your tags
- Attach your policies to IAM users

# What is SnowBall?
* To transfer terabytes of data outside and inside of the AWS environment, a small application called SnowBall is used. 

**Data transferring using SnowBall is done in the following ways:**
- A job is created.
- The SnowBall application is connected.
- The data is copied into the SnowBall application.
- Data is then moved to the AWS S3.

# What are the Storage Classes available in Amazon S3?
**The Storage Classes that are available in the Amazon S3 are the following:**
- Amazon S3 Glacier Instant Retrieval storage class
- Amazon S3 Glacier Flexible Retrieval (Formerly S3 Glacier) storage class
- Amazon S3 Glacier Deep Archive (S3 Glacier Deep Archive)
- S3 Outposts storage class
- Amazon S3 Standard-Infrequent Access (S3 Standard-IA)
- Amazon S3 One Zone-Infrequent Access (S3 One Zone-IA)
- Amazon S3 Standard (S3 Standard)
- Amazon S3 Reduced Redundancy Storage
- Amazon S3 Intelligent-Tiering (S3 Intelligent-Tiering)

# What Is Amazon Virtual Private Cloud (VPC) and Why Is It Used?
* A VPC is the best way of connecting to your cloud resources from your own data center.
* Once you connect your datacenter to the VPC in which your instances are present, each instance is assigned a private IP address that can be accessed from your data center.
* That way, you can access your public cloud resources as if they were on your own private network.

# VPC is not resolving the server through DNS. What might be the issue, and how can you fix it?
* To fix this problem, you need to enable the DNS hostname resolution, so that the problem resolves itself.

# How do you connect multiple sites to a VPC?
* If you have multiple VPN connections, you can provide secure communication between sites using the AWS VPN CloudHub.

# Name and explain some security products and features available in VPC?
**Here is a selection of security products and features:**

- **Security groups** - This acts as a firewall for the EC2 instances, controlling inbound and outbound traffic at the instance level.
- **Network access control lists** - It acts as a firewall for the subnets, controlling inbound and outbound traffic at the subnet level.
- **Flow logs** - These capture the inbound and outbound traffic from the network interfaces in your VPC.

# How do you monitor Amazon VPC?
* You can monitor VPC by using:
    - CloudWatch and CloudWatch logs
    - VPC Flow Logs

# How many Subnets can you have per VPC?
* We can have up to 200 Subnets per Amazon Virtual Private Cloud (VPC).

# When Would You Prefer Provisioned IOPS over Standard Rds Storage?
* You would use Provisioned IOPS when you have batch-oriented workloads.
* Provisioned IOPS delivers high IO rates, but it is also expensive.
* However, batch processing workloads do not require manual intervention.

# How Do Amazon Rds, Dynamodb, and Redshift Differ from Each Other?
* Amazon RDS is a database management service for relational databases.
* It manages patching, upgrading, and data backups automatically.
* It’s a database management service for structured data only.
* On the other hand, DynamoDB is a NoSQL database service for dealing with unstructured data.
* Redshift is a data warehouse product used in data analysis.

# What Are the Benefits of AWS’s Disaster Recovery?
* Businesses use cloud computing in part to enable faster disaster recovery of critical IT systems without the cost of a second physical site.
* The AWS cloud supports many popular disaster recovery architectures ranging from small customer workload data center failures to environments that enable rapid failover at scale.
* With data centers all over the world, AWS provides a set of cloud-based disaster recovery services that enable rapid recovery of your IT infrastructure and data.

# How can you add an existing instance to a new Auto Scaling group?
**Here’s how you can add an existing instance to a new Auto Scaling group:**
- Open EC2 console
- Select your instance under Instances
- Choose Actions -> Instance Settings -> Attach to Auto Scaling Group
- Select a new Auto Scaling group
- Attach this group to the Instance
- Edit the Instance if needed
- Once done, you can successfully add the instance to a new Auto Scaling group

# What are the factors to consider while migrating to Amazon Web Services?
**Here are the factors to consider during AWS migration:**
- Operational Costs - These include the cost of infrastructure, ability to match demand and supply, transparency, and others.
- Workforce Productivity 
- Cost avoidance
- Operational resilience
- Business agility

# What is RTO and RPO in AWS?
* RTO or Recovery Time Objective is the maximum time your business or organization is willing to wait for a recovery to complete in the wake of an outage.
* On the other hand, RPO or Recovery Point Objective is the maximum amount of data loss your company is willing to accept as measured in time.

# If you would like to transfer vast amounts of data, which is the best option among Snowball, Snowball Edge, and Snowmobile?
* AWS Snowball is basically a data transport solution for moving high volumes of data into and out of a specified AWS region.
* On the other hand, AWS Snowball Edge adds additional computing functions apart from providing a data transport solution.
* The snowmobile is an exabyte-scale migration service that allows you to transfer data up to 100 PB.

# Explain what T2 instances are?
* The T2 Instances are intended to give the ability to burst to a higher performance whenever the workload demands it and also provide a moderate baseline performance to the CPU.
* The T2 instances are General Purpose instance types and are low in cost as well. They are usually used wherever workloads do not consistently or often use the CPU.

# What are the advantages of AWS IAM?
* AWS IAM allows an administrator to provide multiple users and groups with granular access.
* Various user groups and users may require varying levels of access to the various resources that have been developed.
* We may assign roles to users and create roles with defined access levels using IAM.
* It further gives us Federated Access, which allows us to grant applications and users access to resources without having to create IAM Roles.

# Explain Connection Draining
* Connection Draining is an AWS service that allows us to serve current requests on the servers that are either being decommissioned or updated.
* By enabling this Connection Draining, we let the Load Balancer make an outgoing instance finish its existing requests for a set length of time before sending it any new requests.
* A departing instance will immediately go off if Connection Draining is not enabled, and all pending requests will fail.

# What is Power User Access in AWS?
* The AWS Resources owner is identical to an Administrator User.
* The Administrator User can build, change, delete, and inspect resources, as well as grant permissions to other AWS users.
* Administrator Access without the ability to control users and permissions is provided to a Power User.
* A Power User Access user cannot provide permissions to other users but has the ability to modify, remove, view, and create resources.

# How is AWS CloudFormation different from AWS Elastic Beanstalk?
* AWS CloudFormation helps you provision and describe all of the infrastructure resources that are present in your cloud environment. On the other hand, AWS Elastic Beanstalk provides an environment that makes it easy to deploy and run applications in the cloud.
* AWS CloudFormation supports the infrastructure needs of various types of applications, like legacy applications and existing enterprise applications. On the other hand, AWS Elastic Beanstalk is combined with the developer tools to help you manage the lifecycle of your applications.

# What are the elements of an AWS CloudFormation template?
* AWS CloudFormation templates are YAML or JSON formatted text files that are comprised of five essential elements, they are:
    - Template parameters
    - Output values
    - Data tables
    - Resources
    - File format version

# What happens when one of the resources in a stack cannot be created successfully?
* If the resource in the stack cannot be created, then the CloudFormation automatically rolls back and terminates all the resources that were created in the CloudFormation template.
* This is a handy feature when you accidentally exceed your limit of Elastic IP addresses or don’t have access to an EC2 AMI.

# How can you automate EC2 backup using EBS?
**Use the following steps in order to automate EC2 backup using EBS:**
- Get the list of instances and connect to AWS through API to list the Amazon EBS volumes that are attached locally to the instance.
- List the snapshots of each volume, and assign a retention period of the snapshot. Later on, create a snapshot of each volume.
- Make sure to remove the snapshot if it is older than the retention period.

# What is the difference between EBS and Instance Store?
* EBS is a kind of permanent storage in which the data can be restored at a later point.
* When you save data in the EBS, it stays even after the lifetime of the EC2 instance.
* On the other hand, Instance Store is temporary storage that is physically attached to a host machine.
* With an Instance Store, you cannot detach one instance and attach it to another.
* Unlike in EBS, data in an Instance Store is lost if any instance is stopped or terminated.

# Can you take a backup of EFS like EBS, and if yes, how?
* Yes, you can use the EFS-to-EFS backup solution to recover from unintended changes or deletion in Amazon EFS.

**Follow these steps:**
- Sign in to the AWS Management Console
- Click the launch EFS-to-EFS-restore button
- Use the region selector in the console navigation bar to select region
- Verify if you have chosen the right template on the Select Template page
- Assign a name to your solution stack
- Review the parameters for the template and modify them if necessary

# How do you auto-delete old snapshots?
**Here’s the procedure for auto-deleting old snapshots:**
- As per procedure and best practices, take snapshots of the EBS volumes on Amazon S3.
- Use AWS Ops Automator to handle all the snapshots automatically.
- This allows you to create, copy, and delete Amazon EBS snapshots.

# What are the different types of load balancers in AWS?
* There are three types of load balancers that are supported by Elastic Load Balancing:
    - Application Load Balancer
    - Network Load Balancer
    - Classic Load Balancer

# What are the different uses of the various load balancers in AWS Elastic Load Balancing?
* **Application Load Balancer**: Used if you need flexible application management and TLS termination.
* **Network Load Balancer**: Used if you require extreme performance and static IPs for your applications.
* **Classic Load Balancer**: Used if your application is built within the EC2 Classic network

# What Is Identity and Access Management (IAM) and How Is It Used?
* Identity and Access Management (IAM) is a web service for securely controlling access to AWS services.
* IAM lets you manage users, security credentials such as access keys, and permissions that control which AWS resources users and applications can access.

# How can you use AWS WAF in monitoring your AWS applications?
* AWS WAF or AWS Web Application Firewall protects your web applications from web exploitations.
* It helps you control the traffic flow to your applications.
* With WAF, you can also create custom rules that block common attack patterns.
* It can be used for three cases: allow all requests, prevent all requests, and count all requests for a new policy.

# What are the different AWS IAM categories that you can control?
* Using AWS IAM, you can do the following:
    - Create and manage IAM users
    - Create and manage IAM groups
    - Manage the security credentials of the users
    - Create and manage policies to grant access to AWS services and resources

# What are the policies that you can set for your users’ passwords?
**Here are some of the policies that you can set:**
- You can set a minimum length of the password, or you can ask the users to add at least one number or special characters in it.
- You can assign requirements of particular character types, including uppercase letters, lowercase letters, numbers, and non-alphanumeric characters.
- You can enforce automatic password expiration, prevent reuse of old passwords, and request for a password reset upon their next AWS sign in.
- You can have the AWS users contact an account administrator when the user has allowed the password to expire. 

# What is the difference between an IAM role and an IAM user?
**The two key differences between the IAM role and IAM user are:**
- An IAM role is an IAM entity that defines a set of permissions for making AWS service requests, while an IAM user has permanent long-term credentials and is used to interact with the AWS services directly.  
- In the IAM role, trusted entities, like IAM users, applications, or an AWS service, assume roles whereas the IAM user has full access to all the AWS IAM functionalities.

# What are the managed policies in AWS IAM?
* There are two types of managed policies; one that is managed by you and one that is managed by AWS.
* They are IAM resources that express permissions using IAM policy language.
* You can create, edit, and manage them separately from the IAM users, groups, and roles to which they are attached.

# How does AWS IAM help your business?
**IAM enables to:**
- Manage IAM users and their access - AWS IAM provides secure resource access to multiple users
- Manage access for federated users – AWS allows you to provide secure access to resources in your AWS account to your employees and applications without creating IAM roles

# What Is Amazon Route 53?
* Amazon Route 53 is a scalable and highly available Domain Name System (DNS).
* The name refers to TCP or UDP port 53, where DNS server requests are addressed.

# What Is Cloudtrail and How Do Cloudtrail and Route 53 Work Together? 
* CloudTrail is a service that captures information about every request sent to the Amazon Route 53 API by an AWS account, including requests that are sent by IAM users.
* CloudTrail saves log files of these requests to an Amazon S3 bucket.
* CloudTrail captures information about all requests.
* You can use information in the CloudTrail log files to determine which requests were sent to Amazon Route 53, the IP address that the request was sent from, who sent the request, when it was sent, and more.

# What is the difference between Latency Based Routing and Geo DNS?
* The Geo Based DNS routing takes decisions based on the geographic location of the request.
* Whereas, the Latency Based Routing utilizes latency measurements between networks and AWS data centers.
* Latency Based Routing is used when you want to give your customers the lowest latency possible.
* On the other hand, Geo Based routing is used when you want to direct the customer to different websites based on the country or region they are browsing from. 

# What is the difference between a Domain and a Hosted Zone?
* **Domain**: A domain is a collection of data describing a self-contained administrative and technical unit. For example, www.tinitiate.com is a domain and a general DNS concept.
* **Hosted zone**: A hosted zone is a container that holds information about how you want to route traffic on the internet for a specific domain. For example, lms.simplilearn.com is a hosted zone.

# How does Amazon Route 53 provide high availability and low latency?
- **Globally Distributed Servers:** Amazon is a global service and consequently has DNS services globally. Any customer creating a query from any part of the world gets to reach a DNS server local to them that provides low latency. 
- **Dependency:** Route 53 provides a high level of dependability required by critical applications
- **Optimal Locations:** Route 53 uses a global anycast network to answer queries from the optimal position automatically. 

# How does AWS Config work with AWS CloudTrail?
* AWS CloudTrail records user API activity on your account and allows you to access information about the activity.
* Using CloudTrail, you can get full details about API actions such as the identity of the caller, time of the call, request parameters, and response elements.
* On the other hand, AWS Config records point-in-time configuration details for your AWS resources as Configuration Items (CIs). 
* You can use a CI to ascertain what your AWS resource looks like at any given point in time.
* Whereas, by using CloudTrail, you can quickly answer who made an API call to modify the resource.
* You can also use Cloud Trail to detect if a security group was incorrectly configured.

# Can AWS Config aggregate data across different AWS accounts?
* Yes, you can set up AWS Config to deliver configuration updates from different accounts to one S3 bucket, once the appropriate IAM policies are applied to the S3 bucket.

# How are reserved instances different from on-demand DB instances?
* Reserved instances and on-demand instances are the same when it comes to function. They only differ in how they are billed.
* Reserved instances are purchased as one-year or three-year reservations, and in return, you get very low hourly based pricing when compared to the on-demand cases that are billed on an hourly basis.

# Which type of scaling would you recommend for RDS and why?
* There are two types of scaling - vertical scaling and horizontal scaling.
* Vertical scaling lets you vertically scale up your master database with the press of a button.
* A database can only be scaled vertically, and there are 18 different instances in which you can resize the RDS.
* On the other hand, horizontal scaling is good for replicas.
* These are read-only replicas that can only be done through Amazon Aurora.

# What is a maintenance window in Amazon RDS? Will your DB instance be available during maintenance events?
* RDS maintenance window lets you decide when DB instance modifications, database engine version upgrades, and software patching have to occur.
* The automatic scheduling is done only for patches that are related to security and durability.
* By default, there is a 30-minute value assigned as the maintenance window and the DB instance will still be available during these events though you might observe a minimal effect on performance.

# What are the consistency models in DynamoDB?
* There are two consistency models In DynamoDB. First, there is the Eventual Consistency Model, which maximizes your read throughput.
* However, it might not reflect the results of a recently completed write.
* Fortunately, all the copies of data usually reach consistency within a second.
* The second model is called the Strong Consistency Model. This model has a delay in writing the data, but it guarantees that you will always see the updated data every time you read it. 

# What type of query functionality does DynamoDB support?
* DynamoDB supports GET/PUT operations by using a user-defined primary key.
* It provides flexible querying by letting you query on non-primary vital attributes using global secondary indexes and local secondary indexes.
 
# Suppose you are a game designer and want to develop a game with single-digit millisecond latency, which of the following database services would you use?
* Amazon DynamoDB

# If you need to perform real-time monitoring of AWS services and get actionable insights, which services would you use?
* Amazon CloudWatch

# As a web developer, you are developing an app, targeted primarily for the mobile platform. Which of the following lets you add user sign-up, sign-in, and access control to your web and mobile apps quickly and easily?
* Amazon Cognito

# You are a Machine Learning Engineer who is on the lookout for a solution that will discover sensitive information that your enterprise stores in AWS and then use NLP to classify the data and provide business-related insights. Which among the services would you choose?
* AWS Macie

# You are the system administrator in your company, which is running most of its infrastructure on AWS. You are required to track your users and keep tabs on how they are being authenticated. You wish to create and manage AWS users and use permissions to allow and deny their access to AWS resources. Which of the following services suits you best?
* AWS IAM

# Which service do you use if you want to allocate various private and public IP addresses to make them communicate with the internet and other instances?
* Amazon VPC

# This service provides you with cost-efficient and resizable capacity while automating time-consuming administration tasks
* Amazon Relational Database Service

# Which of the following is a means for accessing human researchers or consultants to help solve problems on a contractual or temporary basis?
* Amazon Mechanical Turk

# This service is used to make it easy to deploy, manage, and scale containerized applications using Kubernetes on AWS. Which of the following is this AWS service?
* Amazon Elastic Container Service

# This service lets you run code without provisioning or managing servers. Select the correct service from the below options
* AWS Lambda

# As an AWS Developer, using this pay-per-use service, you can send, store, and receive messages between software components. Which of the following is it?
* Amazon Simple Queue Service

# Which service do you use if you would like to host a real-time audio and video conferencing application on AWS, this service provides you with a secure and easy-to-use application?
* Amazon Chime

# As your company's AWS Solutions Architect, you are in charge of designing thousands of similar individual jobs. Which of the following services best meets your requirements?
* AWS Batch

# Differentiate between on-demand instances and spot instances.
* Spot Instances are spare unused Elastic Compute Cloud (EC2) instances that one can bid for.
* Once the bid exceeds the existing spot price (which changes in real-time based on demand and supply), the spot instance will be launched.
* If the spot price exceeds the bid price, the instance can go away anytime and terminate within 2 minutes of notice.
* The best way to decide on the optimal bid price for a spot instance is to check the price history of the last 90 days available on the AWS console.
* The advantage of spot instances is that they are cost-effective, and the drawback is that they can be terminated anytime.
* Spot instances are ideal to use when –
    - There are optional nice-to-have tasks.
    - You have flexible workloads that can run when there is enough computing capacity.
    - Tasks that require extra computing capacity to improve performance.
* On-demand instances are made available whenever you require them, and you need to pay for the time you use them hourly.
* These instances can be released when they are no longer required and do not require any upfront commitment.
* The availability of these instances is guaranteed by AWS, unlike spot instances.
* The best practice is to launch a couple of on-demand instances which can maintain a minimum level of guaranteed compute resources for the application and add on a few spot instances whenever there is an opportunity.

# What is the boot time for an instance store-backed instance?
* The boot time for an Amazon Instance Store-Backed AMI is usually less than 5 minutes.

# Is it possible to vertically scale an Amazon Instance? If yes, how?
**Following are the steps to scale an Amazon Instance vertically –**
- Spin up a larger Amazon instance than the existing one.
- Pause the existing instance to remove the root EBS volume from the server and discard.
- Stop the live running instance and detach its root volume.
- Make a note of the unique device ID and attach that root volume to the new server.
- Start the instance again.

# Differentiate between vertical and horizontal scaling in AWS.
* The main difference between vertical and horizontal scaling is how you add compute resources to your infrastructure.
* In vertical scaling, more power is added to the existing machine.
* In contrast, in horizontal scaling, additional resources are added to the system with the addition of more machines into the network so that the workload and processing are shared among multiple devices.
* The best way to understand the difference is to imagine retiring your Toyota and buying a Ferrari because you need more horsepower.
* This is vertical scaling. Another way to get that added horsepower is not to ditch the Toyota for the Ferrari but buy another car.
* This can be related to horizontal scaling, where you drive several cars simultaneously.
* When the users are up to 100, an Amazon EC2 instance alone is enough to run the entire web application or the database until the traffic ramps up.
* Under such circumstances, when the traffic ramps up, it is better to scale vertically by increasing the capacity of the EC2 instance to meet the increasing demands of the application.
* AWS supports instances up to 128 virtual cores or 488GB RAM.
* When the users for your application grow up to 1000 or more, vertical scaling cannot handle requests, and there is a need for horizontal scaling, which is achieved through a distributed file system, clustering, and load balancing.

# What is the total number of buckets that can be created in AWS by default?
* 100 buckets can be created in each of the AWS accounts.
* If additional buckets are required, increase the bucket limit by submitting a service limit increase.

# Differentiate between Amazon RDS, Redshift, and DynamoDB.
| Features           | Amazon RDS                                           | Redshift                                         | DynamoDB                           |
|--------------------|------------------------------------------------------|--------------------------------------------------|------------------------------------|
| Computing Resources| Instances with 64 vCPU and 244 GB RAM                | Nodes with vCPU and 244 GB RAM                   | Not specified, SaaS                |
| Maintenance Window | 30 minutes every week                                | 30 minutes every week                            | No impact                          |
| Database Engine    | MySQL, Oracle DB, SQL Server, Amazon Aurora, Postgre | Redshift                                         | NoSQL                              |
| Primary Usage       | Conventional Databases                               | Data warehouse                                  | Database for dynamic data         |
| Multi A-Z Replication| Additional Service                                 | Manual                                           | In-built                           |

# An organization wants to deploy a two-tier web application on AWS. The application requires complex query processing and table joins. However, the company has limited resources and requires high availability. Which is the best configuration for the company based on the requirements?
* DynamoDB deals with core problems of database storage, scalability, management, reliability, and performance but does not have an RDBMS’s functionalities.
* DynamoDB does not support complex joins or query processing, or complex transactions.
* You can run a relational engine on Amazon RDS or Amazon EC2 for this kind of functionality.

# What should be the instance’s tenancy attribute for running it on single-tenant hardware?
* The instance tenancy attribute must be set to a dedicated instance, and other values might not be appropriate for this operation.

# What are the important features of a classic load balancer in Amazon Elastic Compute Cloud (EC2)?
- The high availability feature ensures that the traffic is distributed among Amazon EC2 instances in single or multiple availability zones. This ensures a high scale of availability for incoming traffic.
- Classic load balancer can decide whether to route the traffic based on the health check’s results.
- You can implement secure load balancing within a network by creating security groups in a VPC.
- Classic load balancer supports sticky sessions, which ensures a user’s traffic is always routed to the same instance for a seamless experience.

# What parameters will you consider when choosing the availability zone?
* Performance, pricing, latency, and response time are factors to consider when selecting the availability zone.

# Which instance will you use for deploying a 4-node Hadoop cluster in AWS?
* We can use a c4.8x large instance or i2.large for this, but using a c4.8x will require a better configuration on the PC.

# How will you bind the user session with a specific instance in ELB (Elastic Load Balancer)?
* This can be achieved by enabling Sticky Session.

# What are the possible connection issues you encounter when connecting to an Amazon EC2 instance?
- Unprotected private key file
- Server refused key
- Connection timed out
- No supported authentication method available
- Host key not found, permission denied.
- User key not recognized by the server, permission denied.

# Can you run multiple websites on an Amazon EC2 server using a single IP address?
* More than one elastic IP is required to run multiple websites on Amazon EC2.

# What happens when you reboot an Amazon EC2 instance?
* Rebooting an instance is just similar to rebooting a PC.
* You do not return to the image’s original state.
* However, the hard disk contents are the same as before the reboot.

# How is stopping an Amazon EC2 instance different from terminating it?
* Stopping an Amazon EC2 instance result in a normal shutdown being performed on the instance, and the instance is moved to a stop state.
* However, when an EC2 instance is terminated, it is transferred to a stopped state, and any EBS volumes attached to it are deleted and cannot be recovered.

# Mention the native AWS security logging capabilities.
* AWS CloudTrail, AWS Config, AWS Detailed Billing Reports, Amazon S3 Access Logs, Elastic Load Balancing Access Logs, Amazon CloudFront Access Logs, Amazon Redshift Logs, Amazon Relational Database Service (RDS) Logs, Amazon VPC Flow Logs, Centralized Log Management Options

# What is a DDoS attack, and how can you handle it?
* A DDoS attack occurs when a malicious attempt affects the availability of a particular system, such as an application or a website, to the end-users.
* It can be handled by implementing proper DDoS protection mechanisms such as using AWS Shield, CloudFront, and Route 53 for DDoS mitigation.

# What are RTO and RPO in AWS?
* RTO (Recovery Time Objective) is the maximum acceptable delay between the interruption of a service and its restoration.
* RPO (Recovery Point Objective) is the maximum amount of time allowed since the last data recovery point.

# How can you automate EC2 backup by using EBS?
* AWS EC2 instances can be backed up by creating snapshots of EBS volumes, which are stored in Amazon S3.
* Snapshots can capture all the data contained in EBS volumes and create exact copies of this data.
* The snapshots can then be copied and transferred into another AWS region, ensuring safe and reliable storage of sensitive data.

# Explain how one can add an existing instance to a new Auto Scaling group?
* To add an existing instance to a new Auto Scaling group, open the EC2 console, select the instance, go to Actions -> Instance Setting -> Attach to Auto Scaling Group, select a new Auto Scaling group, and link this group to the instance.

# Is it possible to cast-off S3 with EC2 instances? If yes, how?
* It is possible to use S3 with EC2 instances by mounting S3 buckets as a file system on EC2 instances using tools like S3FS or AWS DataSync.

# How can you safeguard EC2 instances running on a VPC?
* You can safeguard EC2 instances running on a VPC by using AWS Security groups to control inbound and outbound traffic, implementing Network Access Control Lists (ACLs) to control traffic at the subnet level, and using AWS Identity and Access Management (IAM) to manage access to EC2 instances.

# How many EC2 instances can be used in a VPC?
* You can run up to a total of 20 on-demand instances across the instance family, purchase 20 reserved instances, and request spot instances as per your dynamic spot limit region.

# What are some of the key best practices for security in Amazon EC2?
- Create individual AWS IAM users to control access.
- Secure the AWS Root account and its access keys.
- Harden EC2 instances by disabling unnecessary services.
- Grant the least privileges.
- Define and review security group rules regularly.
- Have a well-defined, strong password policy for all users.
- Deploy anti-virus software on the AWS network.

# A distributed application that processes huge amounts of data across various EC2 instances. The application is designed to recover gracefully from EC2 instance failures. How will you accomplish this in a cost-effective manner?
* An on-demand or reserved instance will not be ideal in this case, as the task here is not continuous.
* Moreover, Launching an on-demand instance whenever work comes up makes no sense because on-demand instances are expensive.
* In this case, the ideal choice would be to opt for a spot instance owing to its cost-effectiveness and no long-term commitments.

# Will you use encryption for S3?
* It is better to consider encryption for sensitive data on S3 as it is a proprietary technology.

# How can you send a request to Amazon S3?
* Using the REST API or the AWS SDK wrapper libraries, which wrap the underlying Amazon S3 REST API.

# What is the difference between Amazon S3 and EBS?
- Amazon S3
  - **Paradigm:** Object Store
  - **Security:** Private Key or Public Key
  - **Redundancy:** Across data centers
  - **Performance:** Fast

- EBS
  - **Paradigm:** Filesystem
  - **Security:** Visible only to your EC2
  - **Redundancy:** Within the data center
  - **Performance:** Superfast

# Summarize the S3 Lifecycle Policy.
* AWS provides a Lifecycle Policy in S3 as a storage cost optimizer.
* In fact, it enables the establishment of data retention policies for S3 objects within buckets.
* It is possible to manage data securely and set up rules so that it moves between different object classes on a dynamic basis and is removed when it is no longer required.

# What does the AWS S3 object lock feature do?
* We can store objects using the WORM  (write-once-read-many) approach using the S3 object lock.
* An S3 user can use this feature to prevent data overwriting or deletion for a set period of time or indefinitely.
* Several organizations typically use S3 object locks to satisfy legal requirements that require WORM storage.

# What do you understand by AWS policies?
* In AWS, policies are objects that regulate the permissions of an entity (users, groups, or roles) or an AWS resource.
* In AWS, policies are saved as JSON objects.
* Identity-based policies, resource-based policies, permissions borders, Organizations SCPs, ACLs, and session policies are the six categories of policies that AWS offers.

# What does AWS IAM MFA support mean?
* MFA refers to Multi-Factor Authentication.
* AWS IAM MFA adds an extra layer of security by requesting a user's username and password and a code generated by the MFA device connected to the user account for accessing the AWS management console.

# How do IAM roles work?
* IAM Role is an IAM Identity formed in an AWS account and granted particular authorization policies.
* These policies outline what each IAM (Identity and Access Management) role is allowed and prohibited to perform within the AWS account.
* IAM roles do not store login credentials or access keys; instead, a temporary security credential is created specifically for each role session.
* These are typically used to grant access to users, services, or applications that need explicit permission to use an AWS resource.

# What happens if you have an AWS IAM statement that enables a principal to conduct an activity on a resource and another statement that restricts that same action on the same resource?
* If more than one statement is applicable, the Deny effect always succeeds.

# Which identities are available in the Principal element?
* IAM roles & roles from within your AWS accounts are the most important type of identities.
* In addition, you can define federated users, role sessions, and a complete AWS account.
* AWS services like ec2, cloudtrail, or dynamodb rank as the second most significant type of principal.

# If you have half of the workload on the public cloud while the other half is on local storage, what architecture will you use for this?
* Hybrid Cloud Architecture.

# What does an AWS Availability Zone mean?
* AWS availability zones must be traversed to access the resources that AWS has to offer.
* Applications will be designed effectively for fault tolerance.
* Availability Zones have low latency communications with one another to efficiently support fault tolerance.

# What does "data center" mean for Amazon Web Services (AWS)?
* According to the Amazon Web Services concept, the data center consists of the physical servers that power the offered AWS resources.
* Each availability zone will certainly include one or more AWS data centers to offer Amazon Web Services customers the necessary assistance and support.

# How does an API gateway (rest APIs) track user requests?
* As user queries move via the Amazon API Gateway REST APIs to the underlying services, we can track and examine them using AWS X-Ray.

# What distinguishes an EMR task node from a core node?
* A core node comprises software components that execute operations and store data in a Hadoop Distributed File System or HDFS.
* There is always one core node in multi-node clusters.
* Software elements that exclusively execute tasks are found in task nodes.
* Additionally, it is optional and doesn't properly store data in HDFS.

# A content management system running on an EC2 instance is approaching 100% CPU utilization. How will you reduce the load on the EC2 instance?
* This can be done by attaching a load balancer to an auto scaling group to efficiently distribute load among multiple instances.

# What happens when you launch instances in Amazon VPC?
* Each instance has a default IP address when launched in Amazon VPC.
* This approach is considered ideal when connecting cloud resources with data centers.

# Can you modify the private IP address of an EC2 instance while it is running in a VPC?
* It is not possible to change the primary private IP addresses.
* However, secondary IP addresses can be assigned, unassigned, or moved between instances at any given point.

# You are launching an instance under the free usage tier from AMI, having a snapshot size of 50GB. How will you launch the instance under the free usage tier?
* It is not possible to launch this instance under the free usage tier.

# Which load balancer will you use to make routing decisions at the application or transport layer that supports VPC or EC2?
* Classic Load Balancer.

# What is the Terraform provider?
Terraform is a platform for managing and configuring infrastructure resources, including computer systems, virtual machines (VMs), network switches, containers, etc. An API provider is in charge of meaningful API interactions that reveal resources. Terraform works with a wide range of cloud service providers.

# Can we develop on-premise infrastructure using Terraform?
* It is possible to build on-premise infrastructure using Terraform.
* We can choose from a wide range of options to determine which vendor best satisfies our needs. 

# Can you set up several providers using Terraform?
* Terraform enables multi-provider deployments, including SDN management and on-premise applications like OpenStack and VMware.

# What causes a duplicate resource error to be ignored during terraform application?
**Here are some of the possible reasons:**
- Rebuild the resources using Terraform after deleting them from the cloud provider's API.
- Eliminate some resources from the code to prevent Terraform from managing them.
- Import resources into Terraform, then remove any code that attempts to copy them.

# What is a Resource Graph in Terraform?
* The resources are represented using a resource graph.
* You can create and modify different resources at the same time.
* To change the configuration of the graph, Terraform develops a strategy.
* It immediately creates a framework to help us identify drawbacks.

# How does AWS Glue Data Catalog work?
* AWS Glue Data Catalog is a managed AWS service that enables you to store, annotate, and exchange metadata in the AWS Cloud.
* Each AWS account and region has a different set of AWS Glue Data Catalogs.
* It establishes a single location where several systems can store and obtain metadata to keep data in data silos and query and modify the data using that metadata.
* AWS Identity and Access Management (IAM) policies restrict access to the data sources managed by the AWS Glue Data Catalog.

# What exactly does the AWS Glue Schema Registry do?
* You can validate and control the lifecycle of streaming data using registered Apache Avro schemas by the AWS Glue Schema Registry.
* Schema Registry is useful for Apache Kafka, AWS Lambda, Amazon Managed Streaming for Apache Kafka (MSK), Amazon Kinesis Data Streams, Apache Flink, and Amazon Kinesis Data Analytics for Apache Flink.

# What relationship exists between AWS Glue and AWS Lake Formation?
* The shared infrastructure of AWS Glue, which provides serverless architecture, console controls, ETL code development, and task monitoring, is beneficial for AWS Lake Formation. 

# How can AWS Glue Schema Registry keep applications highly available?
* The Schema Registry storage and control layer supports the AWS Glue SLA, and the serializers and deserializers employ best-practice caching techniques to maximize client schema availability.

# What do you understand by the AWS Glue database?
* The AWS Glue Data Catalog database is a container for storing tables.
* You create a database when you launch a crawler or manually add a table.
* The database list in the AWS Glue console contains a list of all of your databases.

# What are the best security techniques in Lambda?
* In Lambda, you can find some of the best alternatives for security.
* When it comes to limiting access to resources, you can use Identity Access and Management.
* Another option that extends permissions is a privilege.
* Access might be restricted to unreliable or unauthorized hosts.
* The security group's regulations can be reviewed over time to maintain the pace. 

# What does Amazon elastic block store mean?
* It is a virtual storage area network that allows for the execution of tasks.
* Users do not need to worry about data loss even if a disk in the RAID is damaged because it can accept flaws easily.
* Elastic Block Storage allows for the provisioning and allocation of storage.
* It can also be linked to the API if necessary.

# How much time can an AWS Lambda function run for?
* After making the requests to AWS Lambda, the entire execution must occur within 300 seconds.
* Although the timeout is set at 3 seconds by default, you can change it to any value between 1 and 300 seconds.

# Is the infrastructure that supports AWS Lambda accessible?
* No, the foundation on which AWS Lambda runs is inaccessible after it begins managing the compute infrastructure on the user's behalf.
* It enables Lambda to carry out health checks, deploy security patches, and execute other standard maintenance.

# Do the AWS Lambda-based functions remain operational if the code or configuration changes?
* Yes. When a Lambda function is updated, there will be a limited timeframe, less than a minute—during which both the old and new versions of the function can handle requests.

# What does AWS DevOps' CodePipeline mean?
* AWS offers a service called CodePipeline that offers continuous integration and continuous delivery features.
* It also offers provisions for infrastructure upgrades.
* The user-defined set release model protocols make it very simple to perform tasks like building, testing, and deploying after each build. 

# How can AWS DevOps manage continuous integration and deployment?
* The source code for an application must be stored and versioned using AWS Developer tools.
* The application is then built, tested, and deployed automatically using the services to an AWS instance or a local environment.
* When implementing continuous integration and deployment services, it is better to start with CodePipeline and use CodeBuild and CodeDeploy as necessary.

# What role does CodeBuild play in the release process automation?
* Setting up CodeBuild first, then connecting it directly with the AWS CodePipeline, makes it simple to set up and configure the release process.
* This makes it possible to add build steps continually, and as a result, AWS handles the processes for continuous integration and continuous deployment.

# Is it possible to use Jenkins and AWS CodeBuild together with AWS DevOps?
* It is simple to combine AWS CodeBuild with Jenkins to perform and execute jobs in Jenkins.
* Creating and manually controlling each worker node in Jenkins is no longer necessary because build jobs are pushed to CodeBuild and then executed there.

# How does CloudFormation vary from AWS Elastic Beanstalk?
* AWS Elastic BeanStalk and CloudFormation are two core services by AWS.
* Their architecture makes it simple for them to work together.
* EBS offers an environment in which cloud-deployed applications can be deployed.
* To manage the lifecycle of the apps, this is incorporated with CloudFormation's tools.
* This makes using several AWS resources quite simple.
* This ensures great scalability in terms of using it for various applications, from older applications to container-based solutions.

# Is one Elastic IP enough for all the instances you have been running?
* There are both public and private addresses for the instances.
* Until the Amazon EC2 or instance is terminated or disabled, the private and public addresses are still associated with them.
* Elastic addresses can be used in place of these addresses, and they remain with the instance as long as the user doesn't explicitly disconnect them.
* There will be a need for more than one Elastic IP if numerous websites are hosted on an EC2 server.

# What networking performance metrics can you expect when launching instances in a cluster placement group?
**The following factors affect network performance:**
- Type of instance
- Network performance criteria

**When instances are launched in a cluster placement group, one should expect the following:**
- Single flow of 10 Gbps.
- 20 Gbps full-duplex
- The network traffic will be restricted to 5 Gbps irrespective of the placement unit.

# What can you do to increase data transfer rates in Snowball?
**The following techniques can speed up data transport solution in Snowballs:**
- Execute multiple copy operations simultaneously.
- Copy data to a single snowball from many workstations.
- To reduce the encryption overhead, it is best to transfer large files into small batches of smaller files.
- Removing any additional hops.

# Consider a scenario where you want to change your current domain name registration to Amazon Route S3 without affecting your web traffic. How can you do it?
**Below are the steps to transfer your domain name registration to Amazon Route S3:**
1. Obtain a list of the DNS records related to your domain name.
2. Create a hosted zone using the Route 53 Management Console, which will store your domain's DNS records, and launch the transfer operation from there.
3. Get in touch with the domain name registrar you used to register. Examine the transfer processes.
4. When the registrar communicates the need for the new name server delegations, your DNS requests will be processed.

# How do you send a request to Amazon S3?
* There are different options for submitting requests to Amazon S3:
    - Use REST APIs.
    - Use AWS SDK Wrapper Libraries.

# Mention the default tables you receive while establishing an AWS VPC.
* When building an AWS VPC, we get the three default tables- Network ACL, Security Group, and Route table.

# How do you ensure the security of your VPC?
* To regulate the security of your VPC, use security groups, network access control lists (ACLs), and flow logs.

# What does security group mean?
* In AWS, security groups, which are essentially virtual firewalls, are used to regulate the inbound and outbound traffic to instances.
* You can manage traffic depending on different criteria, such as protocol, port, and source and destination.

# What purpose does the ELB gateway load balancer endpoint serve?
* Application servers in the service consumer virtual private cloud (VPC) and virtual appliances in that VPC are connected privately using ELB gateway load balancer endpoints.

# How is a VPC protected by the AWS Network Firewall?
* The stateful firewall by AWS Network firewall protects against unauthorized access to your Virtual Private Cloud (VPC) by monitoring connections and identifying protocols.
* This service's intrusion prevention program uses active flow inspection to detect and rectify loopholes in security using single-based detection.
* This AWS service employs web filtering to block known malicious URLs.

# What type of performance can you expect from Elastic Block Storage service? How do you back it up and enhance the performance?
* The performance of elastic block storage varies, i.e., it can go above the SLA performance level and drop below it.
* SLA provides an average disk I/O rate which can, at times, frustrate performance experts who yearn for reliable and consistent disk throughput on a server.
* Virtual AWS instances do not behave this way. One can back up EBS volumes through a graphical user interface like elasticfox or the snapshot facility through an API call.
* Also, the performance can be improved by using Linux software raid and striping across four volumes.

# Imagine that you have an AWS application that requires 24x7 availability and can be down only for a maximum of 15 minutes. How will you ensure that the database hosted on your EBS volume is backed up?
* Automated backups are the key processes as they work in the background without requiring manual intervention.
8 Whenever there is a need to back up the data, AWS API and AWS CLI play a vital role in automating the process through scripts.
* The best way is to prepare for a timely backup of the EBS of the EC2 instance.
* The EBS snapshot should be stored on Amazon S3 (Amazon Simple Storage Service) and can be used to recover the database instance in case of any failure or downtime.

# You create a Route 53 latency record set from your domain to a system in Singapore and a similar record to a machine in Oregon. When a user in India visits your domain, to which location will he be routed?
* Assuming that the application is hosted on an Amazon EC2 instance and multiple instances of the applications are deployed on different EC2 regions.
* The request is most likely to go to Singapore because Amazon Route 53 is based on latency, and it routes the requests based on the location that is likely to give the fastest response possible.

# How will you access the data on EBS in AWS?
* Elastic block storage, as the name indicates, provides persistent, highly available, and high-performance block-level storage that can be attached to a running EC2 instance.
* The storage can be formatted and mounted as a file system, or the raw storage can be accessed directly.

# How will you configure an instance with the application and its dependencies and make it ready to serve traffic?
* You can achieve this with the use of lifecycle hooks.
* They are powerful as they let you pause the creation or termination of an instance so that you can sneak peek in and perform custom actions like configuring the instance, downloading the required files, and any other steps that are required to make the instance ready.
* Every auto-scaling group can have multiple lifecycle hooks.

# What do AWS export and import mean?
* AWS Import/Export enables you to move data across AWS (Amazon S3 buckets, Amazon EBS snapshots, or Amazon Glacier vaults) using portable storage devices.

# What do you understand by AMI?
* AMI refers to Amazon Machine Image. It's a template that includes the details (an operating system, an application server, and apps) necessary to start an instance.
* It is a replica of the AMI executing as a virtual server in the cloud. 

# Define the relationship between an instance and AMI.
* You can launch instances from a single AMI. An instance type specifies the hardware of the host computer that hosts your instance.
* Each type of instance offers different cloud computing and memory resources.
* Once an instance has been launched, it becomes a standard host and can be used in the same way as any other computer.

# Compare AWS with OpenStack.
| Services | AWS | OpenStack |
|----------|-----|-----------|
| User Interface | GUI-Console, API-EC2 API, CLI-Available | GUI-Console, API-EC2 API, CLI-Available |
| Computation | EC2 | Nova |
| File Storage | S3 | Swift |
| Block Storage | EBS | Cinder |
| Networking | IP addressing Egress, Load Balancing Firewall (DNS), VPC | IP addressing load balancing firewall (DNS) |
| Big Data | Elastic MapReduce | - |

# What is AWS?
* AWS (Amazon Web Services) is a platform to provide secure cloud services, database storage, offerings for computing power, content delivery, and other services to help the business scale and develop.

# Give the comparison between AWS and OpenStack.
| Criteria                    | AWS                 | OpenStack        |
|-----------------------------|---------------------|------------------|
| License                     | Amazon proprietary  | Open-source      |
| Operating system            | Provided as per the cloud administrator | AMIs provided by AWS |
| Performing repeatable operations | Through templates | Through text files |

# What is the importance of buffer in Amazon Web Services?
* An Elastic Load Balancer ensures that the incoming traffic is distributed optimally across various AWS instances.
* A buffer will synchronize different components and make the arrangement additionally elastic to a burst of load or traffic.
* The components are prone to working in an unstable way of receiving and processing requests.
* The buffer creates an equilibrium linking various apparatus and crafts them to work at an identical rate to supply more rapid services.

# How are Spot Instance, On-demand Instance, and Reserved Instance different from one another?
- **Spot Instance:** Customers can purchase compute capacity with no upfront commitment at all. Spot Instances are spare Amazon instances that you can bid for. The instance is automatically launched when the bidding price exceeds the spot price, and the spot price fluctuates based on supply and demand for instances. Spot Instances are charged on an hourly basis.
- **On-demand Instance:** Users can launch instances at any time based on the demand. On-demand Instances are suitable for the high-availability needs of applications. On-demand Instances are launched by users only with the pay-as-you-go model. On-demand Instances will remain persistent without any automatic termination from Amazon. On-demand Instances are charged on a per-second basis.

# Why do we make subnets?
* Creating subnets means dividing a large network into smaller ones.
* These subnets can be created for several reasons.
* For example, creating and using subnets can help reduce congestion by making sure that the traffic destined for a subnet stays in that subnet.
* This helps in efficiently routing the to the network, which reduces the network’s load.

# Is there a way to upload a file that is greater than 100 megabytes on Amazon S3?
* Yes, it is possible by using the multipart upload utility from AWS.
* With the multipart upload utility, larger files can be uploaded in multiple parts that are uploaded independently.
* You can also decrease upload time by uploading these parts in parallel.
* After the upload is done, the parts will be merged into a single object or file to create the original file from which the parts were created.

# What is the maximum number of S3 buckets you can create?
* The maximum number of S3 buckets that can be created is 100.

# How can you save the data on root volume on an EBS-backed machine?
* We can save the data by overriding the terminate option.

# When should you use the classic load balancer and the application load balancer?
- **Classic Load Balancer:** Used for simple load balancing of traffic across multiple EC2 instances.
- **Application Load Balancer:** Used for more intelligent load balancing, based on the multi-tier architecture or container-based architecture of the application. Application load balancing is mostly used when there is a need to route traffic to multiple services.

# How many total VPCs per account/region and subnets per VPC can you have?
* You can have a total of 5 VPCs for every account/region and 200 subnets for every VPC that you have.

# Your organization has decided to have all its workloads on the public cloud. But, due to certain security concerns, your organization decides to distribute some of the workload on private servers. You are asked to suggest a cloud architecture for your organization. What will your suggestion be?
* A hybrid cloud. The hybrid cloud architecture is where an organization can use the public cloud for shared resources and the private cloud for confidential workloads.

# Which one of the storage solutions offered by AWS would you use if you need extremely low pricing and data archiving?
* AWS Glacier is an extremely low-cost storage service offered by Amazon that is used for data archiving and backup purposes.
* The longer you store data in Glacier, the lesser it will cost you.

# You have connected four instances to ELB. To automatically terminate your unhealthy instances and replace them with new ones, which functionality would you use?
* Auto-scaling groups

# The data on the root volumes of store-backed and EBS-backed instances get deleted by default when they are terminated. If you want to prevent that from happening, which instance would you use?
* EBS-backed instances. EBS-backed instances use EBS volume as their root volume.
* EBS volume consists of virtual drives that can be easily backed up and duplicated by snapshots.
* The biggest advantage of EBS-backed volumes is that the data can be configured to be stored for later retrieval even if the virtual machine or the instances are shut down.

# How will you configure an Amazon S3 bucket to serve static assets for your public web application?
* By configuring the bucket policy to provide public read access to all objects

# Your organization wants to send and receive compliance emails to its clients using its own email address and domain. What service would you suggest for achieving the same in an easy and cost-effective way?
* Amazon Simple Email Service (Amazon SES), which is a cloud-based email-sending service, can be used for this purpose.

# Can you launch Amazon Elastic Compute Cloud (EC2) instances with predetermined private IP addresses? If yes, then with which Amazon service is it possible?
* Yes. It is possible by using VPC (Virtual Private Cloud).

# If you launch a standby RDS, will it be launched in the same availability zone as your primary?
* No, standby instances are automatically launched in different availability zones than the primary, making them physically independent infrastructures.
* This is because the whole purpose of standby instances is to prevent infrastructure failure.
* So, in case the primary goes down, the standby instance will help recover all of the data.

# What is the name of Amazon's Content Delivery Network?
* Amazon CloudFront

# Which Amazon solution will you use if you want to accelerate moving petabytes of data in and out of AWS, using storage devices that are designed to be secure for data transfer?
* Amazon Snowball. AWS Snowball is the data transport solution for large amounts of data that need to be moved into and out of AWS using physical storage devices.

# If you are running your DB instance as Multi-AZ deployment, can you use standby DB instances along with your primary DB instance?
* No, the standby DB instance cannot be used along with the primary DB instances since the standby DB instances are supposed to be used only if the primary instance goes down.

# Your organization is developing a new multi-tier web application in AWS. Being a fairly new and small organization, there’s limited staff. But, the organization requires high availability. This new application comprises complex queries and table joins. Which Amazon service will be the best solution for your organization’s requirements?
* DynamoDB will be the right choice here since it is designed to be highly scalable, more than RDS or any other relational database service.

# You accidentally stopped an EC2 instance in a VPC with an associated Elastic IP. If you start the instance again, what will be the result?
* Elastic IP will only be disassociated from the instance if it’s terminated.
* If it’s stopped and started, there won’t be any change to the instance, and no data will be lost.

# Your organization has around 50 IAM users. Now, it wants to introduce a new policy that will affect the access permissions of an IAM user. How can it implement this without having to apply the policy at the individual user level?
* It is possible using AWS IAM groups, by adding users in the groups as per their roles and by simply applying the policy to the groups.

# Your organization is using DynamoDB for its application. This application collects data from its users every 10 minutes and stores it in DynamoDB. Then every day, after a particular time interval, the data (respective of each user) is extracted from DynamoDB and sent to S3. Then, the application visualizes this data for the users. You are asked to propose a solution to help optimize the backend of the application for latency at a lower cost. What would you recommend?
* ElastiCache. Amazon ElastiCache is a caching solution offered by Amazon.
* It can be used to store a cached version of the application in a region closer to users so that when requests are made by the users the cached version of the application can respond, and hence latency will be reduced.

# I created a web application with autoscaling. I observed that the traffic on my application is the highest on Wednesdays and Fridays between 9 AM and 7 PM. What would be the best solution for me to handle the scaling?
* Configure a policy in autoscaling to scale as per the predictable traffic patterns.

# How would you handle a situation where the relational database engine crashes often whenever the traffic to your RDS instances increases, given that the replica of RDS instance is not promoted as the master instance?
* A bigger RDS instance type needs to be opted for handling large amounts of traffic, creating manual or automated snapshots to recover data in case the RDS instance goes down.

# You have an application running on your Amazon EC2 instance. You want to reduce the load on your instance as soon as the CPU utilization reaches 100 percent. How will you do that?
* It can be done by creating an autoscaling group to deploy more instances when the CPU utilization exceeds 100 percent and distributing traffic among instances by creating a load balancer and registering the Amazon EC2 instances with it.

# What would I have to do if I want to access Amazon Simple Storage buckets and use the information for access audits?
* AWS CloudTrail can be used in this case as it is designed for logging and tracking API calls, and it has also been made available for storage solutions.

# I created a key in North Virginia region to encrypt my data in Oregon region. I also added three users to the key and an external AWS account. Then, to encrypt an object in S3, when I tried to use the same key, it was not listed. Where did I go wrong?
* The data and the key should be in the same region.
* That is, the data that has to be encrypted should be in the same region as the one in which the key was created.
* In this case, the data is in the Oregon region, whereas the key was created in the North Virginia region.

# Suppose, you hosted an application on AWS that lets the users render images and do some general computing. Which services can you use to route the incoming user traffic?
* **Application Load Balancer:**
    * It supports path-based routing of the traffic and hence helps in enhancing the performance of the application structured as smaller services.
    * Using an application load balancer, the traffic can be routed based on the requests made.
    * In this case scenario, the traffic where requests are made for rendering images can be directed to the servers only deployed for rendering images, and the traffic where requests are made for computing can be directed to the servers deployed only for general computing purposes.

# Suppose, I created a subnet and launched an EC2 instance in the subnet with default settings. Which options will be ready to use on the EC2 instance as soon as it is launched?
* **Private IP:** Private IP is automatically assigned to the instance as soon as it is launched. While elastic IP has to be set manually, Public IP needs an Internet Gateway which again has to be created since it’s a new VPC.

# Your organization has four instances for production and another four for testing. You are asked to set up a group of IAM users that can only access the four production instances and not the other four testing instances. How will you achieve this?
* We can achieve this by defining tags on the test and production instances and then adding a condition to the IAM policy that allows access to specific tags.

# Your organization wants to monitor the read and write IOPS for its AWS MySQL RDS instance and then send real-time alerts to its internal operations team. Which service offered by Amazon can help your organization achieve this scenario?
* Amazon CloudWatch would help us achieve this.
* Since Amazon CloudWatch is a monitoring tool offered by Amazon, it’s the right service to use in the above-mentioned scenario.

# Which services can be used if you want to capture client connection information from your load balancer at a particular time interval?
* Enabling CloudTrail for your load balancer.
* AWS CloudTrail is an inexpensive log monitoring solution provided by Amazon.
* It can provide logging information for load balancers or any other AWS resources.
* The provided information can be further used for analysis.

# You have created a VPC with private and public subnets. In what kind of subnet would you launch the database servers?
* Database servers should be ideally launched on private subnets.
* Private subnets are ideal for the backend services and databases of all applications since they are not meant to be accessed by the users of the applications, and private subnets are not routable from the Internet.

# Is it possible to switch from an Instance-backed root volume to an EBS-backed root volume at any time?
* No, it is not possible.

# Can you change the instance type of the instances that are running in your application tier and are also using autoscaling? If yes, then how?
* Yes, the instance type of such instances can be changed by modifying the autoscaling launch configuration.
* The tags configuration is used to add metadata to the instances.

# Can you name the additional network interface that can be created and attached to your Amazon EC2 instance launched in your VPC?
* AWS Elastic Network Interface

# Out of the following options, where does the user specify the maximum number of instances with the autoscaling commands?
- Autoscaling policy configuration
- Autoscaling group
- Autoscaling tags configuration
- Autoscaling launch configuration
- Autoscaling launch configuration

# Which service provided by AWS can you use to transfer objects from your data center, when you are using Amazon CloudFront?
* **Amazon Direct Connect:** It is an AWS networking service that acts as an alternative to using the Internet to connect customers in on-premise sites with AWS.

# You have deployed multiple EC2 instances across multiple availability zones to run your website. You have also deployed a Multi-AZ RDS MySQL Extra Large DB Instance. The site performs a high number of small read and write operations per second. After some time, you observed that there is read contention on RDS MySQL. What would be your approach to resolve the contention and optimize your website?
* We can deploy ElastiCache in-memory cache running in every availability zone.
* This will help in creating a cached version of the website for faster access in each availability zone.
* We can also add an RDS MySQL read replica in each availability zone that can help with efficient and better performance for read operations.
* So, there will not be any increased workload on the RDS MySQL instance, hence resolving the contention issue.

# Your company wants you to propose a solution so that the company’s data center can be connected to the Amazon cloud network. What would your proposal be?
* The data center can be connected to the Amazon cloud network by establishing a virtual private network (VPN) between the VPC and the data center.
* A virtual private network lets you establish a secure pathway or tunnel from your premise or device to the AWS global network.

# Which of the following Amazon Services would you choose if you want complex querying capabilities but not a whole data warehouse?
* Amazon RDS

# You want to modify the security group rules while it is being used by multiple EC2 instances. Will you be able to do that? If yes, will the new rules be implemented on all previously running EC2 instances that were using that security group?
* Yes, the security group that is being used by multiple EC2 instances can be modified.
* The changes will be implemented immediately and applied to all the previously running EC2 instances without restarting the instances

# Which one of the following is a structured data store that supports indexing and data queries to both EC2 and S3?
* SimpleDB

# Which service offered by Amazon will you choose if you want to collect and process e-commerce data for near real-time analysis? (Choose any two)
* DynamoDB is a fully managed NoSQL database service that can be fed any type of unstructured data.
* Hence, DynamoDB is the best choice for collecting data from e-commerce websites.
* For near-real-time analysis, we can use Amazon Redshift.

# If in CloudFront the content is not present at an edge location, what will happen when a request is made for that content?
* CloudFront will deliver the content directly from the origin server.
* It will also store the content in the cache of the edge location where the content was missing.

# Can you change the private IP address of an EC2 instance while it is in running or in a stopped state?
* No, it cannot be changed.
* When an EC2 instance is launched, a private IP address is assigned to that instance at boot time.
* This private IP address is attached to the instance for its entire lifetime and can never be changed.

# What will you use if you have to move data over long distances using the Internet, from instances that are spread across countries to your Amazon S3 bucket?
* **Amazon Transfer Acceleration:** It throttles the data transfer up to 300 percent using optimized network paths and Amazon Content Delivery Network. Snowball cannot be used here as this service does not support cross-region data transfer.

# Which services is a data storage system that also has a REST API interface and uses secure HMAC-SHA1 authentication keys?
* **Amazon S3:** It gets various requests from applications, and it has to identify which requests are to be allowed and which are to be denied. Amazon S3 REST API uses a custom HTTP scheme based on a keyed HMAC for the authentication of requests.

# What is EC2?
* Launched in 2006, EC2 is a virtual machine that you can use to deploy your own servers in the cloud, giving you OS-level control.
* It helps you have control over the hardware and updates, similar to the case of on-premise servers.
* EC2 can run on either of these operating systems- Microsoft and Linux.
* It can also support applications like Python, PHP, Apache, and more.

# What is Snowball?
* Snowball is an application designed for transferring terabytes of data into and outside of the AWS cloud.
* It uses secured physical storage to transfer the data.
* Snowball is considered a petabyte-scale data transport solution that helps with cost and time savings.

# What is CloudWatch?
* The Amazon CloudWatch is used for monitoring and managing data and getting actionable insights for AWS, on-premise applications, etc.
* It helps you to monitor your entire task stack that includes the applications, infrastructure, and services.
* Apart from this, CloudWatch also assists you in optimizing your resource utilization and cost by providing analytics-driven insights.

# What is Elastic Transcoder?
* In the AWS cloud, the Elastic Transcoder is used for converting media files into versions that can be run/played on devices such as Tablets, PCs, Smartphones, etc.
* It consists of advanced transcoding features with conversion rates starting from $ 0.0075 per minute.

# What does an AMI include?
* AMI stands for Amazon Machine Images. It includes the following:
   - Single or multiple Amazon Elastic Block Store (Amazon EBS) snapshots. Basically, templates for the root volume of the instance.
   - Launch permissions that let AWS accounts use AMI to launch instances.
   - A block device mapping to specify what volumes to be attached to the instance during its launch.

# What are the Storage Classes available in Amazon S3?
**The following storage classes are available in Amazon S3:**
- **S3 Standard-** It is by and large the default storage class. In cases where no specification about the storage class is provided while uploading the object, Amazon S3 assigns the S3 Standard storage class by default.
- **Reduced Redundancy-** It is assigned when non-critical, reproducible data needs to be stored. The Reduced Redundancy Storage class is designed in a way that the above data categories can be stored with less redundancy. However, it is always advisable to go ahead with the S3 Standard storage class.

# What are the native AWS security logging capabilities?
* The native AWS security logging capabilities include AWS CloudTrail, AWS Config, AWS detailed billing reports, Amazon S3 access logs, Elastic load balancing Access logs, Amazon CloudFront access logs, Amazon VPC Flow logs, etc.

# What kind of IP address can you use for your customer gateway (CGW) address?
* We can use the Internet routable IP address, which is a public IP address of your NAT device.

# A Company has a running Web Application Server in the N. Virginia region and the server has a large size EBS volume of approximately 500 GB, and to see the demand of business, the company needs to migrate the server from the current region to another AWS account’s Mumbai location. Which is the best way to migrate the server from the current location to the Mumbai region? And what information AWS administrator does require about AWS A/C?
* Create an AMI of the server running in the North Virginia region.
* Once the AMI is created, The administrator will need the 12-digit account number of the #2 AWS account.
* This is required for copying the AMI which we have created.
* Once the AMI is successfully copied into the Mumbai region, you can launch the instance using copied AMI in the Mumbai region.
* Once the instance is running and if it’s completely operational, the server in the North Virginia region could be terminated.
* This is the best way to migrate a server to a different account without any hassle.

# A start-up company has a web application based in the us-east-1 Region with multiple Amazon EC2 instances running behind an Application Load Balancer across multiple Availability Zones. As the company's user base grows in the us-west-1 region, the company needs a solution with low latency and improved high availability. What should a solutions architect do to achieve it.?
* You need to notice here that, currently, the web application is in the us-ease-1, and the user base grows in the us-east-1 region.
* The very first step, provision multiple EC2 instances (web application servers) and configure an Application Load Balancer in us-west-1.
* Now, create Global Accelerator in AWS Global Accelerator which uses an endpoint group that includes the load balancer endpoints in both regions.

# A company currently operates a web application backed by an Amazon RDS MySQL database. It has automated backups that are run daily and are not encrypted. A security audit requires future backups to be encrypted and unencrypted backups to be destroyed. The company will make at least one encrypted backup before destroying the old backups. What should be done to enable encryption for future backups?
* Create a snapshot of the database.
* Copy it to an encrypted snapshot.
* Restore the database from the encrypted snapshot.

# A company is going to launch one branch in the UK and needs to continue with its existing main branch in the USA. The company has almost 15 GB of data which is stored in an S3 Bucket in the Ohio region and data is stored with the default storage class. The Company also wants to provide its updated & stored data in the London S3 bucket using one zone accessibility storage class to save storage costs. In addition, the company also wants that the data must be updated automatically in S3’s London bucket; if any data is modified or written in the S3 bucket in Ohio.
* Configure Cross Region Replication Rule in the Ohio region bucket and select the destination bucket in the London region to replicate the data and store it in the destination using one zone IA storage class to save cost.

# The data on the root volumes of store-backed and EBS-backed instances get deleted by default when they are terminated. If you want to prevent that from happening, which instance would you use? And ensure if the EC2 instance is restarted, the data or configuration in the EC2 instance should not be lost.
* EBS-backed instances or instances with EBS Volume.
* EBS-backed instances use EBS volume as their root volume.
* These volumes contain Operating Systems, Applications, and Data.
* We can create Snapshots from these volumes or AMI from Snapshots.

# You have an application running on an EC2 instance. You need to reduce the load on your instance as soon as the CPU utilization reaches 80 percent. How will you accomplish the job?
* It can be done by creating an autoscaling group to deploy more instances when the CPU utilization of the EC2 instance exceeds 80 percent and distributing traffic among instances by creating an application load balancer and registering EC2 instances as target instances.

# In AWS, three different storage services are available, such as EFS, S3, and EBS. When should I use Amazon EFS vs. Amazon S3 vs. Amazon Elastic Block Store (EBS)?
* Amazon Web Services (AWS) offers cloud storage services to support a wide range of storage workloads.
* **Amazon EFS** is a file storage service for use with Amazon compute (EC2, containers, and serverless) and on-premises servers. Amazon EFS provides a file system interface, file system access semantics (such as strong consistency and file locking), and concurrently accessible storage for up to thousands of Amazon EC2 instances.
* **Amazon EBS** is a block-level storage service for use with Amazon EC2. Amazon EBS can deliver performance for workloads that require the lowest latency for access to data from a single EC2 instance.
* **Amazon S3** is an object storage service. Amazon S3 makes data available through an Internet API that can be accessed anywhere

# A company's web application is using multiple Linux Amazon EC2 instances and stores data on Amazon EBS volumes. The company is looking for a solution to increase the resiliency of the application in case of a failure and to provide storage that complies with atomicity, consistency, isolation, and durability (ACID). What should a solution architect do to meet these requirements?
* Create an Application Load Balancer with AWS Auto Scaling groups across multiple Availability Zones.
* Store data on Amazon EFS and mount a target on each instance.

# An application running on AWS uses an Amazon Aurora Multi-AZ deployment for its database. When evaluating performance metrics, a solutions architect discovered that the database reads were causing high I/O and adding latency to the write requests against the database. What should the solution architect do to separate the read requests from the write requests?
* Create a read replica and modify the application to use the appropriate endpoint.

# A client reports that they wanted to see an audit log of any changes made to AWS resources in their account. What can the client do to achieve this?
* Enable AWS CloudTrail logs to be delivered to an Amazon S3 bucket

# Usually, you have noticed that one EBS volume can be connected with one EC2 instance, our company wants to run a business-critical application on multiple instances in a single region and needs to store all instances output in single storage within the VPC. Instead of using EFS, our company is recommending the use of multi-attach volume with instances. As an architect, you need to suggest to them what instance type and EBS volumes they should use.
* The instance type should be EC2 Nitro-based instances and Provisioned IOPs io1 multi-attach EBS volumes.

# A company is using a VPC peering connection option to connect its multiple VPCs in a single region to allow for cross VPC communication. A recent increase in account creation and VPCs has made it difficult to maintain the VPC peering strategy, and the company expects to grow to hundreds of VPCs. There are also new requests to create site-to-site VPNs with some of the VPCs. A solutions architect has been tasked with creating a central networking setup for multiple accounts and VPNs. Which networking solution would you recommend to resolve it?
* Configure a transit gateway with AWS Transit Gateway and connect all VPCs and VPNs.

# An organization has multiple facilities in various continents such as North America, Europe, and the Asia Pacific. The organization is designing a new distributed application to manage and optimize its global supply chain and its manufacturing process. It needs to design the process in such a way that the booked order in one continent should be able to support data failover with a short Recovery Time Objective (RTO). The uptime of the application should not impact manufacturing, what kind of solution would you recommend as a solution architect?
* Use Amazon DynamoDB global tables feature for the database

# What do you understand by VPC?
* VPC is the abbreviated form of Virtual Private Cloud.
* It allows you to launch AWS resources that can be defined by you and fully customize the network configurations.
* Through VPC, you can define and take full control of your virtual network environment.
* For example- you can have a private address range, internet gateways, subnets, etc.

# What are key pairs?
* When connecting to an Amazon EC2 instance, you need to prove your identity.
* Key pairs are used to execute this.
* Basically, a  key pair is a set of security credentials that are used during identity proofing.
* It consists of a public key and a private key.

# What are policies and what are the different types of policies?
* Policies define the permissions required to execute an operation, irrespective of the method used to perform it. AWS supports six types of policies:
* **Identity-based policies-** These are JSON permissions policy documents that control what actions an identity can perform, under what conditions, and on which resources. These policies are further classified into 2 categories:
    * **Managed Policies–** These policies are standalone identity-based policies that can be attached to different users, groups in your AWS environment.
    * **Inline policies-** These policies are directly attached to a single user, group, or role. In situations where inline policies are used, a strict one-to-one relationship between a policy and an identity is maintained. 
* **Resource-based policies-** These policies are the ones attached to a resource such as an Amazon S3 bucket. They define which actions can be performed on the particular resource and under what circumstances.
* **IAM permissions boundaries-** They actually refer to the maximum level of permissions that identity-based policies can grant to the specific entity.
* **Service Control Policies (SCPs)-** SCPs are the maximum level of permissions for an organization or organizational unit.
* **Access Control lists-** They define and control which principals in another AWS account can access the particular resource.
* **Session policies-** They are advanced policies that are passed as a parameter when a temporary session is programmatically created for a role or federated user.

# Unable to ping Instance We launched a Windows 2019 IIS server in the Ohio region and deployed a dynamic website in this server, in addition, the webserver also connected with a backend MS-SQL server to store and access data related to the application. Our users were able to access the website over the Internet. The next day our client informed us that they were able to access the website, but weren’t able to ping the server from the Internet. To ensure ICMP rule in Security Group, we checked, and the Security Group had allowed rule from 0.0.0.0/0. Would you try to help troubleshoot the issue?
* If the client is able to access the website from his/her end, it means the connection is perfect and there is no issue with connectivity and the Security Group configuration also seems correct.
* We can check the internal firewall of the Windows 2019 IIS server.
* If it is blocking ICMP traffic, we should enable it.

# Mention some of the significant features of AWS Glue.
* Here are some of the significant features of AWS Glue listed below.
    * Serverless data integration
    * Data quality and monitoring
    * Glue can automatically find structured and semi-structured data kept in your data lake on Amazon S3, data warehouse on Amazon Redshift, and other storage locations.
    * Automatically creates Scala or Python code for your ETL tasks.
    * Allows you to visually clean and normalize data without any code.

# In AWS Glue, how do you enable and disable a trigger?
* You can execute the below commands to start or stop the trigger using the AWS CLI.
    * aws glue start-trigger –name MyTrigger
    * aws glue stop-trigger –name MyTrigger

# What is a connection in AWS Glue?
* Connection in AWS Glue is a service that stores information required to connect to a data source such as Redshift, RDS, S3, or DynamoDB.

# How can you start an AWS Glue workflow run using AWS CLI?
* Using the start-workflow-run command of AWS CLI and passing the workflow name, one can start the Glue workflow.

# What is AWS Glue?
* AWS Glue is a data integration service offered by Amazon that makes it easy to discover, prepare, move, and transform your data for analytics and application development.

# What data sources does AWS Glue support?
* AWS Glue can integrate with more than 80 data sources on AWS, on premises, and on other clouds.
* The service natively supports data stored in the following databases in your Amazon Virtual Private Cloud (Amazon VPC) running on Amazon Elastic Compute Cloud (Amazon EC2):
    * Amazon Aurora
    * Amazon RDS for MySQL
    * Amazon RDS for Oracle
    * Amazon RDS for PostgreSQL
    * Amazon RDS for SQL Server
    * Amazon Redshift
    * Amazon DynamoDB
    * Amazon S3
    * MySQL, Oracle, Microsoft SQL Server, and PostgreSQL

# What programming language can we use to write my ETL code for AWS Glue?
* We can use either Scala or Python.

# Can we write my own code?
* Yes. We can write your own code using the AWS Glue ETL library.

# How does AWS Glue keep my data secure?
* AWS Glue provides server-side encryption for data at rest and SSL for data in motion.

# How do we monitor the execution of my AWS Glue jobs?
* AWS Glue provides the status of each job and pushes all notifications to CloudWatch.

# Explain what S3 is.
* S3 stands for Simple Storage Service.
* It is an object-based storage service on AWS.
* It is a pay-as-you-go service with the help of which you can store and extract any amount of data at any time from anywhere on the web.

# What is the Replication Rule feature supported by AWS S3?
* Amazon S3 offers a lot of useful features.
* One of the features is the Replication Rule feature, which allows users to replicate the data to a secondary region.

# What are the different ways to encrypt a file in S3?
* To encrypt a file in Amazon S3, users need to choose an appropriate encryption option.
* AWS S3 offers multiple encryption options such as:
    - Server-Side Encryption with Amazon S3 Managed Keys (SSE-S3)
    - Server-Side Encryption with AWS Key Management Service (SSE-KMS)
    - Server-Side Encryption with Customer-Provided Keys (SSE-C)
    - Client-Side Encryption.

# What is static website hosting in S3?
* Static website hosting in S3 is a feature that allows users to host static web content directly from an S3 bucket.

# Is there any possible way to restore the deleted S3 objects?
* Yes, you can restore the deleted S3 objects easily if you have a versioning-enabled bucket.

# What is the maximum number of S3 buckets you can create?
* The maximum number of S3 buckets that can be created is 100.

# How will you configure an Amazon S3 bucket to serve static assets for your public web application?
* By configuring the bucket policy to provide public read access to all objects.

# What are the Storage Classes available in Amazon S3?
**The following storage classes are available in Amazon S3:**
- **S3 Standard:** It is the default storage class for Amazon S3, providing high durability, availability, and performance.
- **S3 Intelligent-Tiering:** Automatically moves data between two access tiers based on access patterns.
- **S3 Standard-IA (Infrequent Access):** Suitable for data that is accessed less frequently but requires rapid access when needed.
- **S3 One Zone-IA:** Similar to S3 Standard-IA but stores data in a single Availability Zone, reducing costs.
- **S3 Glacier:** Designed for long-term archive and digital preservation, with retrieval times ranging from minutes to hours.
- **S3 Glacier Deep Archive:** Lowest-cost storage class for long-term retention and digital preservation, with long retrieval times.
- **S3 Outposts:** Storage class for objects stored on AWS Outposts, offering S3 storage on-premises.

# What is an S3 general purpose bucket?
* A general-purpose bucket in Amazon S3 is a bucket that can store objects of any storage class except S3 Express One Zone.
* It is the original type of S3 bucket and is suitable for most use cases and access patterns.

# How is Amazon S3 data organized?
* Amazon S3 organizes data as objects, each identified by a unique key within a bucket.
* The key is used to retrieve the object and can mimic hierarchical directory structures using delimiter characters.

# What do you understand about Amazon EC2?
* Amazon Elastic Compute Cloud (EC2) is a web service that provides resizable compute capacity in the cloud.
* It allows users to rent virtual servers (instances) to run their applications.

# What is the Security Group in Amazon EC2?
* A security group in Amazon EC2 acts as a virtual firewall for your instances, controlling inbound and outbound traffic.
* It specifies which traffic is allowed to reach the instances.

# Explain Stop vs. Terminate an Amazon EC2 instance.
- **Stop:** Halts the instance but does not delete it. The instance can be restarted and retains its configuration and data.
- **Terminate:** Deletes the instance permanently. The instance cannot be restarted, and all data is lost.

# What is the use of regions and availability zones in Amazon EC2 configuration?
* Regions are geographical locations where Amazon EC2 data centers are located.
* Each region has multiple availability zones, which are isolated locations with their own infrastructure and power source.
* Availability zones provide redundancy and fault tolerance.

# What is the placement group in EC2?
* A placement group in Amazon EC2 is a logical grouping of instances within a single availability zone to ensure low latency and high throughput.

# You have an application running on your Amazon EC2 instance. You want to reduce the load on your instance as soon as the CPU utilization reaches 100 percent. How will you do that?
* It can be done by creating an autoscaling group to deploy more instances when the CPU utilization exceeds 100 percent and distributing traffic among instances by creating a load balancer and registering the EC2 instances with it.

# Suppose, I created a subnet and launched an EC2 instance in the subnet with default settings. Which of the following options will be ready to use on the EC2 instance as soon as it is launched?
* **Private IP:** Private IP is automatically assigned to the instance as soon as it is launched.

# Can you name the additional network interface that can be created and attached to your Amazon EC2 instance launched in your VPC?
** AWS Elastic Network Interface (ENI)

# You want to modify the security group rules while it is being used by multiple EC2 instances. Will you be able to do that? If yes, will the new rules be implemented on all previously running EC2 instances that were using that security group?
* Yes, the security group that is being used by multiple EC2 instances can be modified.
* The changes will be implemented immediately and applied to all the previously running EC2 instances without restarting the instances.

# Can you change the private IP address of an EC2 instance while it is in running or in a stopped state?
* No, it cannot be changed.
* The private IP address is assigned to the instance at boot time and remains the same for the instance's lifetime.

# What is Amazon Virtual Private Cloud (VPC), and why is it used?
* Amazon Virtual Private Cloud (VPC) is a service that allows you to create a private, isolated section of the AWS cloud where you can launch AWS resources.
* It is used to define a virtual network environment in which you can isolate your resources and control your network settings.

# What is an AWS Load Balancer?
* An AWS Load Balancer is a service that distributes incoming traffic across multiple targets, such as EC2 instances, in multiple Availability Zones to ensure high availability and fault tolerance.

# What is AWS SNS?
* Amazon Simple Notification Service (SNS) is a fully managed messaging service that allows you to send notifications to a variety of endpoints, such as email, SMS, HTTP, and others.

# What are the different types of load balancers in EC2?
**There are three types of load balancers in EC2:**
- **Application Load Balancer (ALB):** Routes traffic based on application-level information, such as HTTP headers and cookies.
- **Network Load Balancer (NLB):** Routes traffic based on network-level information, such as IP address and TCP port.
- **Classic Load Balancer (CLB):** Provides basic load balancing across multiple EC2 instances.

# What is AWS CloudFormation?
* AWS CloudFormation is a service that allows you to define your infrastructure as code using a template.
* It automates the provisioning and updating of your AWS resources, making it easier to manage your infrastructure.

# What would I have to do if I want to access Amazon Simple Storage buckets and use the information for access audits?
* You can use AWS CloudTrail to log and track API calls to Amazon S3 buckets, which can be used for access audits.

# What are the native AWS security logging capabilities?
* AWS offers several native security logging capabilities, including AWS CloudTrail for API logging, Amazon GuardDuty for threat detection, AWS Config for configuration auditing, and Amazon Inspector for security assessments.

# You have an application running on an EC2 instance. You need to reduce the load on your instance as soon as the CPU utilization reaches 80 percent. How will you accomplish the job?
* It can be done by creating an autoscaling group to deploy more instances when the CPU utilization of the EC2 instance exceeds 80 percent and distributing traffic among instances by creating an application load balancer and registering EC2 instances as target instances.

# What are the Storage Classes available in Amazon S3?
- **S3 Standard:** For frequently accessed data.
- **S3 Intelligent-Tiering:** Automatically moves data between two access tiers.
- **S3 Standard-IA:** For data that is accessed less frequently.
- **S3 One Zone-IA:** For data that is accessed less frequently but requires rapid access when needed.
- **S3 Glacier:** For long-term archive and digital preservation.
- **S3 Glacier Deep Archive:** For long-term retention and digital preservation at the lowest cost.
- **S3 Outposts:** For storing objects on AWS Outposts.

# What is an S3 general purpose bucket?
* A general-purpose bucket in Amazon S3 is a bucket that can store objects of any storage class except S3 Express One Zone.
* It is suitable for most use cases and access patterns.

# How is Amazon S3 data organized?
* Amazon S3 organizes data as objects identified by a unique key within a bucket.
* Keys can mimic hierarchical directory structures using delimiter characters.

# What do you understand about Amazon EC2?
* Amazon Elastic Compute Cloud (EC2) is a web service that provides resizable compute capacity in the cloud.
* It allows users to rent virtual servers (instances) to run their applications.

# What is the Security Group in Amazon EC2?
* A security group in Amazon EC2 acts as a virtual firewall for instances, controlling inbound and outbound traffic.

# Explain Stop vs. Terminate an Amazon EC2 instance.
- **Stop:** Halts the instance but does not delete it. The instance can be restarted.
- **Terminate:** Deletes the instance permanently. All data is lost.

# What is the use of regions and availability zones in Amazon EC2 configuration?
* Regions are geographical locations of AWS data centers.
* Availability zones are isolated locations within regions with their own infrastructure.

# What is the placement group in EC2?
* A placement group in Amazon EC2 is a logical grouping of instances within a single availability zone for low latency and high throughput.

# You have an application running on your Amazon EC2 instance. You want to reduce the load on your instance as soon as the CPU utilization reaches 100 percent. How will you do that?
* Create an autoscaling group to deploy more instances when CPU utilization exceeds 100 percent and distribute traffic among instances using a load balancer.

# You want to modify the security group rules while it is being used by multiple EC2 instances. Will you be able to do that? If yes, will the new rules be implemented on all previously running EC2 instances that were using that security group?
* Yes, the security group that is being used by multiple EC2 instances can be modified.
* The changes will be applied to all previously running instances without restarting them.

# Can you change the private IP address of an EC2 instance while it is in running or in a stopped state?
* No, the private IP address is assigned at boot time and remains the same for the instance's lifetime.

# What is Amazon Virtual Private Cloud (VPC), and why is it used?
* Amazon Virtual Private Cloud (VPC) is a service that allows you to create a private, isolated network within AWS.
* It is used to define a virtual network environment in which you can launch AWS resources.

# What is an AWS Load Balancer?
* An AWS Load Balancer is a service that distributes incoming traffic across multiple targets, such as EC2 instances, for high availability and fault tolerance.

# What is AWS SNS?
* Amazon Simple Notification Service (SNS) is a fully managed messaging service that sends notifications to a variety of endpoints.

# What are the different types of load balancers in EC2?
* There are three types of load balancers in EC2: Application Load Balancer (ALB), Network Load Balancer (NLB), and Classic Load Balancer (CLB).

# What is AWS CloudFormation?
* AWS CloudFormation is a service that allows you to define your infrastructure as code using templates, automating the provisioning and updating of AWS resources.

# What would I have to do if I want to access Amazon S3 buckets and use the information for access audits?
* Use AWS CloudTrail to log and track API calls to Amazon S3 buckets for access audits.

# What are the native AWS security logging capabilities?
* AWS offers several native security logging capabilities, including AWS CloudTrail for API logging, Amazon GuardDuty for threat detection, AWS Config for configuration auditing, and Amazon Inspector for security assessments.

# You have an application running on an EC2 instance. You need to reduce the load on your instance as soon as the CPU utilization reaches 80 percent. How will you accomplish the job?
* Create an autoscaling group to deploy more instances when CPU utilization exceeds 80 percent and distribute traffic among instances using an application load balancer.

# Is it possible to switch from an Instance-backed root volume to an EBS-backed root volume at any time?
* No, it is not possible.

# Your organization has around 50 IAM users. Now, it wants to introduce a new policy that will affect the access permissions of an IAM user. How can it implement this without having to apply the policy at the individual user level?
* It is possible using AWS IAM groups, by adding users in the groups as per their roles and by simply applying the policy to the groups.

# What is the difference between stateful and stateless filtering?
* Stateful filtering evaluates the origin IP address for any request coming to your server, whereas stateless filtering evaluates both the origin and the destination IP address.

# What are the internet gateways in VPC?
* Internet gateways are components that allow resources within your VPC to communicate to and from the Internet.

# What are the security groups in a VPC?
* Security groups are essential elements that handle the flow of data within the Virtual Private Cloud.
* They possess the capability to function as formidable firewalls by employing distinct regulations that govern the movement of information.
* These security groups exist both within the Virtual Private Cloud and in the EC2 segments of the Amazon Web Services console.

# What is an Elastic IP address?
* An Elastic IP address is more like a public IP address, which is connected to the AWS account until a user terminates it.

# What is a NAT device?
* NAT stands for Network Address Translation and as the name implies, it replaces the IP address for devices that are running in our network, i.e., when we send any traffic from any device to the internet, it will replace the IP address of the device with another IP address.

# How many total VPCs per account/region and subnets per VPC can you have?
* We can have a total of 5 VPCs for every account/region and 200 subnets for every VPC that you have.

# You accidently stopped an EC2 instance in a VPC with an associated Elastic IP. If you start the instance again, what will be the result?
* Elastic IP will only be disassociated from the instance if it’s terminated.
* If it’s stopped and started, there won’t be any change to the instance, and no data will be lost.

# You have created a VPC with private and public subnets. In what kind of subnet would you launch the database servers?
* Database servers should be ideally launched on private subnets.
* Private subnets are ideal for the backend services and databases of all applications since they are not meant to be accessed by the users of the applications, and private subnets are not routable from the Internet.

# How many subnets can we create per VPC?
* Currently, you can create 200 subnets per VPC.

# Can I monitor the network traffic in my VPC?
* Yes. You can use Amazon VPC traffic mirroring and Amazon VPC flow logs features to monitor the network traffic in your Amazon VPC.

# Explain a project you’ve worked on wherein you created an ETL job using AWS Glue.
- Created an ETL pipeline to transform and load data from various sources into a data warehouse using AWS Glue.
- Utilized Glue's dynamic frame capabilities to handle semi-structured data like JSON and XML.
- Scheduled the Glue job to run at specific intervals using AWS CloudWatch Events.
- Implemented error handling and logging within the Glue job to ensure data integrity and traceability.

# What steps do you follow to monitor the cost and performance of a Glue job?
- Set up CloudWatch Alarms to monitor metrics such as job duration, errors, and resource utilization.
- Utilize AWS Cost Explorer to analyze the cost breakdown of Glue jobs over time.
- Implement logging and monitoring within the Glue job itself to track its progress and performance.
- Periodically review and optimize the Glue job configurations based on performance metrics and cost analysis.

# Have you integrated any other AWS big data services with Glue? If yes, which ones and how?
- Yes, integrated AWS Glue with Amazon S3 for storing input and output data.
- Utilized Amazon Athena for ad-hoc querying of data cataloged by Glue.
- Incorporated Amazon Redshift for running complex analytical queries on transformed data.
- Leveraged AWS Lambda for orchestrating additional data processing tasks triggered by Glue job completion.

# Have you ever come across errors when creating a Glue job? If yes, how do you handle or troubleshoot errors?
- Yes, encountered errors related to schema inference, data type mismatches, and resource limitations.
- Troubleshoot errors by reviewing Glue job logs and CloudWatch metrics to identify the root cause.
- Adjust Glue job configurations, such as memory allocation and parallelism, to optimize performance and resolve errors.
- Validate input data quality and schema compatibility to prevent runtime errors during job execution.

# What measures have you implemented to optimize the performance of your Glue job when working with big data?
- Partitioned input data in Amazon S3 to improve data processing parallelism and efficiency.
- Leveraged Glue's job bookmarks feature to resume processing from the last checkpoint, reducing redundant computations.
- Optimized SQL queries and transformations to minimize data shuffling and optimize resource utilization.
- Utilized Glue's development endpoint for iterative development and testing, ensuring efficient job performance before deployment.


# You have a web server on an EC2 instance. Your instance can get to the web, but nobody can get to your web server. How will you troubleshoot this issue?
- Check security group settings for the EC2 instance to ensure that port 80 (HTTP) or port 443 (HTTPS) is open to inbound traffic from the internet.
- Verify network ACL settings at the subnet level to ensure that traffic is allowed from the internet to the EC2 instance.
- Check if the instance's public IP address is associated correctly, and if necessary, assign an Elastic IP (EIP) to ensure persistence.
- Review route table configurations to confirm that the internet gateway is properly attached to the VPC and associated with the subnet where the EC2 instance resides.

# What steps will you perform to enable a server in a private subnet of a VPC to download updates from the web?
- Set up a NAT gateway or NAT instance in a public subnet to provide outbound internet access for instances in the private subnet.
- Update the route table of the private subnet to route internet-bound traffic to the NAT gateway or NAT instance.
- Ensure that security group rules allow outbound traffic from the private subnet to the internet on the necessary ports (e.g., HTTP, HTTPS).
- Configure the instance's proxy settings, if required, to route traffic through the NAT gateway or NAT instance for internet access.

# How will you build a self-healing AWS cloud architecture?
- Utilize Auto Scaling groups to automatically replace unhealthy instances with new ones based on predefined policies and health checks.
- Implement AWS Lambda functions triggered by CloudWatch Events to respond to system events and perform automated remediation tasks.
- Leverage Amazon CloudWatch alarms to monitor system metrics and trigger actions for scaling, restarting, or repairing resources.
- Design applications with built-in fault tolerance and redundancy, utilizing multiple availability zones and resilient data storage solutions.

# How will you design an Amazon Web Services cloud architecture for failure?
- Design applications and services with redundancy across multiple AWS availability zones to mitigate single points of failure.
- Implement automated backups and replication strategies for critical data using services like Amazon S3, RDS, or DynamoDB.
- Utilize AWS CloudFormation or Infrastructure as Code (IaC) tools to define and deploy resilient architectures consistently.
- Regularly test failure scenarios and disaster recovery procedures through simulated drills and chaos engineering practices.

# As an AWS solution architect, how will you implement disaster recovery on AWS?
- Establish a comprehensive disaster recovery (DR) plan outlining recovery objectives, RTO (Recovery Time Objective), and RPO (Recovery Point Objective).
- Utilize AWS services such as AWS Backup, AWS Storage Gateway, and AWS Database Migration Service (DMS) for data replication and backup across regions.
- Implement multi-region deployments and failover strategies using services like Amazon Route 53 for DNS failover and AWS Global Accelerator for traffic routing.
- Automate DR processes with AWS Lambda functions, AWS Step Functions, and AWS CloudFormation templates to streamline recovery procedures and minimize downtime.

# You run a news website in the eu-west-1 region, which updates every 15 minutes. The website is accessed by audiences across the globe and uses an auto-scaling group behind an Elastic Load Balancer and Amazon Relational Database Service. Static content for the application is on Amazon S3 and is distributed using CloudFront. The auto-scaling group is set to trigger a scale-up event with 60% CPU utilization. You use an extra-large DB instance with 10,000 Provisioned IOPS that gives CPU Utilization of around 80% with freeable memory in the 2GB range. The web analytics report shows that the load time for the web pages is an average of 2 seconds, but the SEO consultant suggests that you bring the average load time of your pages to less than 0.5 seconds. What will you do to improve the website's page load time for your users?
- Implement caching mechanisms for frequently accessed content using Amazon CloudFront and leverage edge caching for static assets to reduce latency.
- Optimize database performance by analyzing query execution plans, indexing strategies, and utilizing read replicas to offload read-heavy workloads from the primary database instance.
- Utilize AWS Lambda@Edge to perform serverless compute at CloudFront edge locations for dynamic content personalization and optimization.
- Implement front-end optimization techniques such as lazy loading, image compression, and minimizing HTTP requests to reduce page load times further.
- Monitor website performance using Amazon CloudWatch metrics and implement continuous performance tuning based on real-time data and user feedback.

# How will you right-size a system for normal and peak traffic situations?
- Analyze historical traffic patterns and usage metrics to understand resource utilization trends during normal and peak periods.
- Utilize AWS Auto Scaling to automatically adjust resource capacity based on demand, setting appropriate scaling policies and thresholds for scaling in and out.
- Implement predictive scaling based on forecasting techniques and machine learning models to anticipate traffic spikes and proactively adjust resources.
- Monitor application performance and response times using AWS CloudWatch metrics to ensure optimal resource allocation and identify potential bottlenecks.
- Continuously review and optimize system architecture and resource provisioning based on evolving usage patterns and business requirements.

# Tell us about a situation where you were given feedback that made you change your architectural design strategy.
- While designing a microservices-based architecture for a client, I initially proposed a synchronous communication pattern using RESTful APIs for inter-service communication.
- After receiving feedback from the development team regarding the potential performance and scalability issues associated with synchronous communication, I revisited the design and adopted an asynchronous messaging approach using Amazon Simple Queue Service (SQS) and Amazon Simple Notification Service (SNS).
- This change not only improved the system's reliability and fault tolerance but also allowed for better decoupling between services, enabling independent scalability and faster response times.

# What challenges are you looking forward to for the position as an AWS Solutions Architect?
- I look forward to addressing complex architectural challenges such as designing highly available and scalable distributed systems, optimizing performance and cost efficiency, and ensuring security and compliance.
- I am excited about staying updated with the latest AWS services and technologies and leveraging them to solve real-world business problems effectively.
- I anticipate collaborating with cross-functional teams and stakeholders to understand their requirements and translate them into robust and scalable AWS solutions.
- I am eager to tackle challenges related to migration, modernization, and innovation, helping organizations harness the full potential of cloud computing and AWS services to achieve their goals.

# Describe a successful AWS project that reflects your design and implementation experience with AWS Solutions Architecture.
- One successful AWS project I led involved migrating a legacy monolithic application to a modern microservices architecture on AWS.
- I designed a scalable and fault-tolerant infrastructure using AWS services such as Amazon EC2, Amazon RDS, Amazon S3, Amazon ECS, and Amazon SQS.
- Leveraging AWS CloudFormation and Infrastructure as Code (IaC) practices, I automated the deployment and management of the entire infrastructure stack, enabling rapid provisioning and consistent configuration.
- By implementing containerization with Amazon ECS and adopting a microservices architecture, we achieved improved scalability, reliability, and agility, leading to faster time-to-market and reduced operational overhead.

# How will you design an e-commerce application using AWS services?
- Design a multi-tier architecture with separate layers for presentation, application logic, and data storage, utilizing services such as Amazon EC2, AWS Lambda, Amazon API Gateway, and Amazon RDS.
- Implement high availability and fault tolerance by deploying application components across multiple AWS availability zones and using Elastic Load Balancing and Auto Scaling.
- Utilize Amazon DynamoDB or Amazon Aurora for scalable and high-performance database storage, ensuring efficient handling of transactional and analytical workloads.
- Implement caching mechanisms using Amazon ElastiCache to improve application performance and reduce database load.
- Leverage AWS Identity and Access Management (IAM) for secure authentication and authorization, and implement encryption for data at rest and in transit using AWS Key Management Service (KMS) and AWS Certificate Manager.

# What characteristics will you consider when designing an Amazon Cloud solution?
- **Scalability:** Ability to handle varying workloads and scale resources up or down based on demand.
- **Reliability:** Ensuring high availability and fault tolerance through redundancy and failover mechanisms.
- Performance: Optimizing system performance and response times to meet user expectations and SLAs.
- **Security:** Implementing robust security measures to protect data, applications, and infrastructure from unauthorized access and breaches.
- **Cost Efficiency:** Optimizing resource utilization and minimizing costs through efficient resource provisioning and management.
- **Flexibility:** Designing flexible architectures that can adapt to changing business requirements and technological advancements.
- **Manageability:** Simplifying deployment, monitoring, and management of cloud resources through automation and centralized management tools.

# When would you prefer to use provisioned IOPS over Standard RDS storage?
- Provisioned IOPS (Input/Output Operations Per Second) is preferred for database workloads that require consistent and predictable performance, such as OLTP (Online Transaction Processing) applications.
- Use provisioned IOPS when the application requires low latency and high throughput for read and write operations, and when maintaining a specific level of I/O performance is critical for business operations.
- Standard RDS storage, on the other hand, is suitable for applications with moderate or variable I/O requirements, where cost optimization is a primary consideration, and where performance consistency is less critical.

# What do you think AWS is missing from a Solutions Architect’s perspective?
- While AWS offers a comprehensive set of services and features, there is always room for improvement and innovation.
- From a Solutions Architect's perspective, AWS could enhance support for multi-cloud and hybrid cloud architectures, providing better integration and interoperability with other cloud providers and on-premises environments.
- AWS could also improve tools and services for cost optimization, providing more granular cost visibility and management capabilities to help organizations optimize their cloud spending effectively.
- Additionally, enhanced support for industry-specific compliance requirements and regulatory standards would benefit Solutions Architects in designing and implementing solutions for regulated industries such as healthcare and finance.

# What if Google decides to host YouTube.com on AWS? How will you design the solution architecture?
- If Google decides to host YouTube.com on AWS, I would design a scalable and highly available architecture leveraging AWS services to meet the demands of a large-scale video streaming platform.
- I would deploy YouTube.com across multiple AWS availability zones for high availability and fault tolerance, using Elastic Load Balancing and Auto Scaling to distribute traffic and scale resources dynamically based on demand.
- Utilizing Amazon S3 for storing and serving video content, Amazon CloudFront for global content delivery, and Amazon EC2 for hosting application servers, I would design a distributed and performant infrastructure to ensure low-latency streaming for users worldwide.
- Implementing Amazon Aurora or Amazon DynamoDB for scalable and high-performance database storage, I would ensure efficient handling of user data, metadata, and analytics.
- Leveraging AWS Lambda for serverless compute and AWS Elasticache for caching, I would optimize application performance and cost efficiency, while AWS CloudWatch would provide comprehensive monitoring and operational insights to ensure smooth operation and performance optimization over time.

# What is Cloud Computing? Can you talk about and compare any two popular Cloud Service Providers?
| Parameters     | AWS                            | Azure                       |
|----------------|--------------------------------|-----------------------------|
| Initiation     | 2006                           | 2010                        |
| Market Share   | 4x                             | x                           |
| Implementation | Less Options                   | More Experimentation Possible |
| Features       | Widest Range Of Options        | Good Range Of Options       |
| App Hosting    | AWS not as good as Azure       | Azure Is Better             |
| Development    | Varied & Great Features        | Varied & Great Features     |
| IaaS Offerings | Good Market Hold               | Better Offerings than AWS   |

# I have some private servers on my premises, also I have distributed some of my workload on the public cloud, what is this architecture called?
* This type of architecture would be a hybrid cloud.
* Because we are using both, the public cloud, and your on premises servers i.e the private cloud.
* To make this hybrid architecture easy to use, wouldn’t it be better if your private and public cloud were all on the same network(virtually).
* This is established by including your public cloud servers in a virtual private cloud, and connecting this virtual cloud with your on premise servers using a VPN(Virtual Private Network).

# What is Auto-scaling?
* Auto-scaling is a feature that allows you to provision and launch new instances based on demand.
* It enables you to automatically raise or reduce resource capacity in response to demand.

# What is geo-targeting in CloudFront?
* Geo-targeting is a concept in which businesses may deliver customized information to their audience depending on their geographic location without altering the URL.
* This allows you to produce personalized content for a specific geographical audience while keeping their demands in mind.

# Define and explain the three initial orders of all services and the AWS products erected on them.
* There are three primary types of cloud services: computing, storage, and networking. 
* Then there are AWS products built based on the three orders of all services.
* Computing services such as EC2, Elastic Beanstalk, Lambda, Auto-Scaling, and Lightsail are exemplifications.
* Storage such as S3, Glacier, Elastic Block Storage, and the Elastic File System exemplify the storage.
* Networking such as VPC, Amazon CloudFront, and Route53 are exemplifications of networking services.

# What are the steps involved in a CloudFormation Solution?
1. Create a new CloudFormation template or utilize an existing one in JSON or YAML format.
2. Save the code in an S3 bucket, which will act as a repository for it.
3. To call the bucket and construct a stack on your template, use AWS CloudFormation.
4. CloudFormation scans the file and understands the services that are called, their sequence, and the relationships between the services before provisioning them one by one.

# What are the main features of Cloud Computing?
**Cloud computing has the following key characteristics:**
- Massive amounts of computing resources can be provisioned quickly.
- Resources can be accessed from any location with an internet connection due to its location independence.
- Unlike physical devices, cloud storage has no capacity constraints which makes it very efficient for storage.
- Multi-Tenancy allows a large number of users to share resources.
- Data backup and disaster recovery are becoming easier and less expensive with cloud computing.
- Its Scalability enables businesses to scale up and scale down as needed with cloud computing.

# Explain AWS.
* AWS is an abbreviation for Amazon Web Services, which is a collection of remote computing services also known as Cloud Computing.
* This technology is also known as IaaS, or Infrastructure as a Service.

# Name some of the non-regional AWS services.
**Some of the non-regional AWS services:** 
- CloudFront 
- IAM
- Route 53 
- Web Application Firewall

# What are the different layers that define cloud architecture?
**The following are the various layers operated by cloud architecture:**
- CLC or Cloud Controller.
- Cluster Controller 
- SC or Storage Controller
- NC, or Node Controller
- Walrus

# What are the tools and techniques that you can use in AWS to identify if you are paying more than you should be, and how to correct it?
**You may ensure that you are paying the proper amount for the resources you use by utilizing the following resources:**
- **Check out the Top Services Table**- It is a dashboard in the expense management interface that displays the top five most used services. This will show you how much money you are spending on the resources in question.
- **Cost Finder-** There are cost explorer programs accessible that will allow you to see and evaluate your consumption expenditures over the previous 13 months. You may also receive a cost prediction for the next three months.
- **AWS Budgets-** This helps you create a budget for the services. It will also allow you to see if the current plan suits your budget and the specifics of how you utilize the services.
- **Cost Allocation Labels-** This aids in determining the resource that has cost the most in a given month. It allows you to categorize your resources and cost allocation tags in order to keep track of your AWS charges.

# What are the various layers of cloud computing? Explain their work.
**Cloud computing categories have various layers that include:**
- Infrastructure as a Service (IaaS) is the on-demand provision of services such as servers, storage, networks, and operating systems.
- Platform as a Service (PaaS) combines IaaS with an abstracted collection of middleware services, software development, and deployment tools. 
- PaaS also enables developers to create web or mobile apps in the cloud quickly.
- Software as a Service (SaaS)  is a software application that has been delivered on-demand, in a multi-tenant model
- Function as a Service (FaaS) enables end users to build and execute app functionalities on a serverless architecture.

# What are the various Cloud versions?
**There are several models for deploying cloud services:**
- The public cloud is a collection of computer resources such as hardware, software, servers, storage, and so on that are owned and operated by third-party cloud providers for use by businesses or individuals.
- A private cloud is a collection of resources owned and managed by an organization for use by its employees, partners, or customers.
- A hybrid cloud combines public and private cloud services.

# Is there any other alternative tool to log into the cloud environment other than the console?
**The following will help you in logging into AWS resources:**
- Putty
- AWS CLI for Linux
- AWS CLI for Windows
- AWS CLI for Windows CMD
- AWS SDK
- Eclipse

# What are the native AWS Security logging capabilities?
* Most AWS services provide logging capabilities. AWS CloudTrail, AWS Config, and others, for example, have account level logging.

**Let’s look at two specific services:**
- **AWS CloudTrail**
  This is a service that gives a history of AWS API calls for each account. It also allows you to undertake security analysis, resource change tracking, and compliance audits on your AWS environment. The nice aspect about this service is that you can set it to send notifications via AWS SNS when fresh logs are provided.
- **AWS Setup**
  This helps you comprehend the configuration changes that occur in your environment. This service offers an AWS inventory that contains configuration history, configuration change notification, and links between AWS resources. It may also be set to send notifications via AWS SNS when fresh logs are received.

# What is a DDoS attack, and what services can minimize them?
* DDoS is a cyber-attack in which the culprit visits a website and creates several sessions, preventing genuine users from accessing the service.
* The following native tools will help you in preventing DDoS attacks on your AWS services:
    - AWS Shield
    - AWS WAF
    - Amazon CloudFront
    - Amazon Route53
    - ELB
    - VPC

# List the pros and cons of serverless computing.
**Advantages:**
- Cost-effective
- Operations have been simplified.
- Improves Productivity
- Scalable

**Disadvantages:**
- This can result in response latency
- Due to resource constraints, it is not suitable for high-computing operations.
- Not very safe.
- Debugging can be difficult.

# What characteristics distinguish cloud architecture from traditional cloud architecture?
**The characteristics are as follows:**
- In the cloud, hardware requirements are met based on the demand generated by cloud architecture.
- When there is a demand for resources, cloud architecture can scale them up.
- Cloud architecture can manage and handle dynamic workloads without a single point of failure.

# What are the featured services of AWS?
**AWS’s key components are as follows:**
- **Elastic compute cloud (EC2):** It is a computing resource that is available on demand for hosting applications. In times of uncertain workloads, EC2 comes in handy.
- **Route 53:**  It is a web-based DNS service.
- **Simple Storage Device S3:** This is a storage device service that is widely used in AWS Identity and Access Management.
- **Elastic Block Store:** It allows you to store constant volumes of data and is integrated with EC2. It also allows you to persist data.
- **Cloud watch:** It allows you to monitor the critical areas of AWS and even set a reminder for troubleshooting.
- **Simple Email Service:** It allows you to send emails using regular SMTP or a restful API call.

# What does the following command do with respect to the Amazon EC2 security groups? `ec2-create-group CreateSecurityGroup`
* A Security group is just like a firewall, it controls the traffic in and out of your instance.
* In AWS terms, the inbound and outbound traffic. The command mentioned is pretty straight forward, it says create security group, and does the same.
* Moving along, once your security group is created, you can add different rules in it.
* For example, you have an RDS instance, to access it, you have to add the public IP address of the machine from which you want to access the instance in its security group.

# You have a video trans-coding application. The videos are processed according to a queue. If the processing of a video is interrupted in one instance, it is resumed in another instance. Currently there is a huge back-log of videos which needs to be processed, for this you need to add more instances, but you need these instances only until your backlog is reduced. Which of these would be an efficient way to do it?
* You should be using an On Demand instance for the same.
* First of all, the workload has to be processed now, meaning it is urgent, secondly you don’t need them once your backlog is cleared, therefore Reserved Instance is out of the picture, and since the work is urgent, you cannot stop the work on your instance just because the spot price spiked, therefore Spot Instances shall also not be used. 

# You have a distributed application that periodically processes large volumes of data across multiple Amazon EC2 Instances. The application is designed to recover gracefully from Amazon EC2 instance failures. You are required to accomplish this task in the most cost effective way. what will meet your requirements?
* Since the work we are addressing here is not continuous, a reserved instance shall be idle at times, same goes with On Demand instances.
* Also it does not make sense to launch an On Demand instance whenever work comes up, since it is expensive.
* Hence Spot Instances will be the right fit because of their low rates and no long term commitments.

# How is stopping and terminating an instance different from each other?
**Starting, stopping and terminating are the three states in an EC2 instance, let’s discuss them in detail:**
- **Stopping and Starting an instance:** When an instance is stopped, the instance performs a normal shutdown and then transitions to a stopped state. All of its Amazon EBS volumes remain attached, and you can start the instance again at a later time. You are not charged for additional instance hours while the instance is in a stopped state.
- **Terminating an instance:** When an instance is terminated, the instance performs a normal shutdown, then the attached Amazon EBS volumes are deleted unless the volume’s deleteOnTermination attribute is set to false. The instance itself is also deleted, and you can’t start the instance again at a later time.

# If I want my instance to run on a single-tenant hardware, which value do I have to set the instance’s tenancy attribute to?
* The Instance tenancy attribute should be set to Dedicated Instance.

# When will you incur costs with an Elastic IP address (EIP)?
* You are not charged, if only one Elastic IP address is attached with your running instance.
* But you do get charged in the following conditions:
    - When you use more than one Elastic IPs with your instance.
    - When your Elastic IP is attached to a stopped instance.
    - When your Elastic IP is not attached to any instance.

# How is a Spot instance different from an On-Demand instance or Reserved Instance?
* First of all, let’s understand that Spot Instance, On-Demand instance and Reserved Instances are all models for pricing.
* Moving along, spot instances provide the ability for customers to purchase compute capacity with no upfront commitment, at hourly rates usually lower than the On-Demand rate in each region.
* Spot instances are just like bidding, the bidding price is called Spot Price.
* The Spot Price fluctuates based on supply and demand for instances, but customers will never pay more than the maximum price they have specified.
* If the Spot Price moves higher than a customer’s maximum price, the customer’s EC2 instance will be shut down automatically.
* But the reverse is not true, if the Spot prices come down again, your EC2 instance will not be launched automatically, one has to do that manually.
*  In Spot and On demand instance, there is no commitment for the duration from the user side, however in reserved instances one has to stick to the time period that he has chosen.

# Are the Reserved Instances available for Multi-AZ Deployments?
* Reserved Instances is a pricing model, which is available for all instance types in EC2.

# How to use the processor state control feature available on the c4.8xlarge instance?
**The processor state control consists of 2 states:**
- **The C state** – Sleep state varying from c0 to c6. C6 being the deepest sleep state for a processor
- **The P state** – Performance state p0 being the highest and p15 being the lowest possible frequency.
* Now, why the C state and P state. Processors have cores, these cores need thermal headroom to boost their performance. Now since all the cores are on the processor the temperature should be kept at an optimal state so that all the cores can perform at the highest performance.
* If a core is put into sleep state it will reduce the overall temperature of the processor and hence other cores can perform better. Now the same can be synchronized with other cores, so that the processor can boost as many cores it can by timely putting other cores to sleep, and thus get an overall performance boost.
* Concluding, the C and P state can be customized in some EC2 instances like the c4.8xlarge instance and thus you can customize the processor according to your workload.

# What kind of network performance parameters can you expect when you launch instances in a cluster placement group?
* The network performance depends on the instance type and network performance specification, if launched in a placement group you can expect up to:
    - 10 Gbps in a single-flow,
    - 20 Gbps in multiflow i.e full duplex
    - Network traffic outside the placement group will be limited to 5 Gbps(full duplex).

# To deploy a 4 node cluster of Hadoop in AWS which instance type can be used?
* First let’s understand what actually happens in a Hadoop cluster, the Hadoop cluster follows a master-slave concept.
* The master machine processes all the data, slave machines store the data and act as data nodes.
* Since all the storage happens at the slave, a higher capacity hard disk would be recommended and since the master does all the processing, a higher RAM and a much better CPU is required.
* Therefore, you can select the configuration of your machine depending on your workload.
* For e.g. – In this case c4.8xlarge will be preferred for the master machine whereas for the slave machine we can select the i2.large instance.
* If you don’t want to deal with configuring your instance and installing Hadoop cluster manually, you can straight away launch an Amazon EMR (Elastic Map Reduce) instance which automatically configures the servers for you.
* You dump your data to be processed in S3, EMR picks it from there, processes it, and dumps it back into S3.

# Where do you think an AMI fits when you are designing an architecture for a solution?
*  AMIs (Amazon Machine Images) are like templates of virtual machines and an instance is derived from an AMI.
* AWS offers pre-baked AMIs which you can choose while you are launching an instance, some AMIs are not free, therefore can be bought from the AWS Marketplace.
* You can also choose to create your own custom AMI which would help you save space on AWS.
* For example, if you don’t need a set of software on your installation, you can customize your AMI to do that.
* This makes it cost-efficient, since you are removing the unwanted things.

# Is one Elastic IP address enough for every instance that I have running?
* Depends! Every instance comes with its own private and public address.
* The private address is associated exclusively with the instance and is returned to Amazon EC2 only when it is stopped or terminated.
* Similarly, the public address is associated exclusively with the instance until it is stopped or terminated.
* However, this can be replaced by the Elastic IP address, which stays with the instance as long as the user doesn’t manually detach it.
* But what if you are hosting multiple websites on your EC2 server, in that case, you may require more than one Elastic IP address.

# What are the best practices for Security in Amazon EC2?
* There are several best practices to secure Amazon EC2. A few of them are given below:
    - Use AWS Identity and Access Management (IAM) to control access to your AWS resources.
    - Restrict access by only allowing trusted hosts or networks to access ports on your instance.
    - Review the rules in your security groups regularly, and ensure that you apply the principle of least Privilege – only open up permissions that you require.
    - Disable password-based logins for instances launched from your AMI. Passwords can be found or cracked and are a security risk.

# How can you upgrade or downgrade a system with little to no downtime?
**The following steps can be used to update or downgrade a system with near-zero downtime:**
- Launch the EC2 console
- Select the AMI Operating System
- Create an instance using the new instance type
- Install the updates and set up apps
- Check to determine if the instances are operational
- Deploy the new instance and replace all the old ones
- Upgrade or downgrade the system with very little to no downtime

# What’s the Amazon EC2 root device volume?
* The image used to boot an EC2 instance is saved on the root device slice, which happens when an Amazon AMI launches a new EC2 case.
* This root device volume is supported by EBS or an instance store.
* In general, the lifetime of an EC2 instance does not affect the root device data stored on Amazon EBS.

# Mention and explain the many types of Amazon EC2 instances.
**The various instances available on Amazon EC2:**
- **General-purpose Instances:** They are used to compute a wide range of tasks and aid in allocating processor, memory, and networking resources.
- **Instances optimized for computing:** These are suitable for compute-intensive workloads. They can handle batch processing workloads, high-performance web servers, machine learning inference, and a wide range of other tasks.
- **Memory-optimized:** They process and provide tasks that manage massive datasets in memory.
- **Computing speed:** It accelerates the execution of floating-point number calculations, data pattern matching, and graphics processing.
- **Optimized Storage:** They conduct operations on local storage that need sequential read and write access to big data sets.

# What exactly do you mean by ‘changing’ in Amazon EC2?
* Amazon EC2 now provides the option for customers to move from the current ‘instance count-based constraints’ to the new ‘vCPU Based restrictions.’
* As a result, when launching a demand-driven mix of instance types, usage is assessed in terms of the number of vCPUs.

# Your application is running on an EC2 instance. When your instance’s CPU consumption reaches 80%, you must lower the load on it. What method do you employ to finish the task?
* Setting up an autoscaling group to deploy new instances when an EC2 instance’s CPU consumption exceeds 80% and distributing traffic among instances via the deployment of an application load balancer and the designation of EC2 instances as target instances can do this.

# How does one set up CloudWatch to recover an EC2 instance?
**Here’s how you can set them up:**
- Using Amazon CloudWatch, create an alarm.
- Navigate to the Define Alarm -> Actions tab of the Alarm.
- Choose the Option to Recover This Instance

# How do you recover/log in to an EC2 instance for which you have lost the key?
**If you have lost your key, follow the procedures below to recover an EC2 instance:**
- Verify that the EC2Config service is operating.
- Detach the instance’s root volume.
- Connect the volume to a temporary instance.
- Change the configuration file.
- Restart the original instance.

# What exactly is Amazon S3?
* S3 stands for Simple Storage Service, and Amazon S3 is the most extensively used storehouse platform.
* S3 is an object storehouse service that can store and recoup any volume of data from any position.
* Despite its rigidity, it’s basically measureless as well as cost-effective because it’s on- a demand storehouse.
* Away from these advantages, it provides new situations of continuity and vacuity.
* Amazon S3 aids in data operation for cost reduction, access control, and compliance.

# What Storage Classes are available in Amazon S3?
**The following Storage Classes are accessible using Amazon S3:**
- Storage class Amazon S3 Glacier Instant Retrieval
- Amazon S3 Glacier Flexible Retrieval Storage Class (Formerly S3 Glacier)
- Glacier Deep Archive on Amazon S3 (S3 Glacier Deep Archive)
- Storage class S3 Outposts
- Amazon S3 Standard-Occasional Access (S3 Standard-IA)
- Amazon S3 One Zone-Only Occasional Access (S3 One Zone-IA)
- Amazon S3 Basic (S3 Standard)
- Amazon S3 Storage with Reduced Redundancy
- Intelligent-Tiering on Amazon S3 (S3 Intelligent-Tiering)

# How do you auto-delete old snapshots?
- Take snapshots of the EBS volumes on Amazon S3 in accordance with process and best practices.
- To manage all of the snapshots automatically, use AWS Ops Automator.
- You may use this to generate, copy, and remove Amazon EBS snapshots.

# You need to configure an Amazon S3 bucket to serve static assets for your public-facing web application. Which method will ensure that all objects uploaded to the bucket are set to public read?
- Rather than making changes to every object, it's better to set the policy for the whole bucket.
- IAM is used to give more granular permissions, since this is a website, all objects would be public by default.

# A customer wants to leverage Amazon Simple Storage Service (S3) and Amazon Glacier as part of their backup and archive infrastructure. The customer plans to use third-party software to support this integration. Which approach will limit the access of the third-party software to only the Amazon S3 bucket named “company-backup”?
- This use case involves more granular permissions, hence IAM would be used here.

# Can S3 be used with EC2 instances, if yes, how?
- Yes, it can be used for instances with root devices backed by local instance storage.
- By using Amazon S3, developers have access to the same highly scalable, reliable, fast, inexpensive data storage infrastructure that Amazon uses to run its own global network of web sites.
- In order to execute systems in the Amazon EC2 environment, developers use the tools provided to load their Amazon Machine Images (AMIs) into Amazon S3 and to move them between Amazon S3 and Amazon EC2.
- Another use case could be for websites hosted on EC2 to load their static content from S3.

# A customer implemented AWS Storage Gateway with a gateway-cached volume at their main office. An event takes the link between the main and branch office offline. Which methods will enable the branch office to access their data?
- Restore by implementing a lifecycle policy on the Amazon S3 bucket.
- The fastest way to do it would be launching a new storage gateway instance.
- Since time is the key factor which drives every business, troubleshooting this problem will take more time. Rather than we can just restore the previous working state of the storage gateway on a new instance.

# When you need to move data over long distances using the internet, for instance across countries or continents to your Amazon S3 bucket, which method or service will you use?
### A) Amazon Glacier
### B) Amazon CloudFront
### C) Amazon Transfer Acceleration
### D) Amazon Snowball
- Answer C.
- Transfer Acceleration shall be the right choice here as it throttles your data transfer with the use of optimized network paths and Amazon’s content delivery network upto 300% compared to normal data transfer speed.

# How can you speed up data transfer in Snowball?
- By performing multiple copy operations at one time i.e. if the workstation is powerful enough, you can initiate multiple cp commands each from different terminals, on the same Snowball device.
- Copying from multiple workstations to the same snowball.
- Transferring large files or by creating a batch of small file, this will reduce the encryption overhead.
- Eliminating unnecessary hops i.e. make a setup where the source machine(s) and the snowball are the only machines active on the switch being used, this can hugely improve performance.

# What’s the distinction between EBS and Instance Store?
- EBS is a type of persistent storage that allows data to be recovered at a later time.
- When you save data to the EBS, it remains long after the EC2 instance has been terminated.
- Instance Store, on the other hand, is temporary storage that is physically tied to a host system.
- You cannot remove one instance and attach it to another using an Instance Store.
- Data in an Instance Store, unlike EBS, is lost if any instance is stopped or terminated.

# How can you use EBS to automate EC2 backup?
- Get a list of instances and connect to AWS through API to get a list of Amazon EBS volumes that are associated to the instance locally.
- List each volume’s snapshots and give a retention time to each snapshot.
- Create a snapshot of each volume afterwards.
- Remove any snapshots that are older than the retention term.

# What Is Amazon Virtual Private Cloud (VPC) and How Does It Work?
- A VPC is the most efficient way to connect to your cloud services from within your own data centre.
- When you link your datacenter to the VPC that contains your instances, each instance is allocated a private IP address that can be accessed from your datacenter.
- As a result, you may use public cloud services as if they were on your own private network.

# If you want to launch Amazon Elastic Compute Cloud (EC2) instances and assign each instance a predetermined private IP address you should:
- The best way of connecting to your cloud resources (for ex- ec2 instances) from your own data center (for eg- private cloud) is a VPC.
- Once you connect your datacenter to the VPC in which your instances are present, each instance is assigned a private IP address which can be accessed from your datacenter.
- Hence, you can access your public cloud resources, as if they were on your own network.

# What are some of the security products and features offered in VPC?
- **Security groups** – serve as a firewall for EC2 instances, allowing you to regulate inbound and outgoing traffic at the instance level.
- **Network access control lists** – It operates as a subnet-level firewall, managing inbound and outgoing traffic.
- **Flow logs** – capture inbound and outgoing traffic from your VPC’s network interfaces.

# How many Subnets are allowed in a VPC?
- Each Amazon Virtual Private Cloud may support up to 200 Subnets (VPC).

# Can I connect my corporate datacenter to the Amazon Cloud?
- Yes, you can do this by establishing a VPN(Virtual Private Network) connection between your company’s network and your VPC (Virtual Private Cloud), this will allow you to interact with your EC2 instances as if they were within your existing network.

# Is it possible to change the private IP addresses of an EC2 while it is running/stopped in a VPC?
- Primary private IP address is attached with the instance throughout its lifetime and cannot be changed, however secondary private addresses can be unassigned, assigned or moved between interfaces or instances at any point.

# Why do you make subnets?
- If there is a network which has a large no. of hosts, managing all these hosts can be a tedious job.
- Therefore we divide this network into subnets (sub-networks) so that managing these hosts becomes simpler.

# In CloudFront what happens when content is NOT present at an Edge location and a request is made to it?
- CloudFront is a content delivery system, which caches data to the nearest edge location from the user, to reduce latency.
- If data is not present at an edge location, the first time the data may get transferred from the original server, but from the next time, it will be served from the cached edge.

# If I’m using Amazon CloudFront, can I use Direct Connect to transfer objects from my own data center?
- Yes. Amazon CloudFront supports custom origins including origins from outside of AWS.
- With AWS Direct Connect, you will be charged with the respective data transfer rates.

# If my AWS Direct Connect fails, will I lose my connectivity?
- If a backup AWS Direct connect has been configured, in the event of a failure it will switch over to the second one.
- It is recommended to enable Bidirectional Forwarding Detection (BFD) when configuring your connections to ensure faster detection and failover.
- If you have configured a backup IPsec VPN connection instead, all VPC traffic will failover to the backup VPN connection automatically.
- Traffic to/from public resources such as Amazon S3 will be routed over the Internet.
- If you do not have a backup AWS Direct Connect link or a IPsec VPN link, then Amazon VPC traffic will be dropped in the event of a failure.

# If I launch a standby RDS instance, will it be in the same Availability Zone as my primary?
- No, since the purpose of having a standby instance is to avoid an infrastructure failure, therefore the standby instance is stored in a different availability zone, which is a physically different independent infrastructure.

# When would I prefer Provisioned IOPS over Standard RDS storage?
- Provisioned IOPS deliver high IO rates but on the other hand it is expensive as well.
- Batch processing workloads do not require manual intervention they enable full utilization of systems, therefore a provisioned IOPS will be preferred for batch-oriented workload.

# Given that the RDS instance replica is not promoted as the master instance, how would you handle a situation in which the relational database engine routinely collapses as traffic to your RDS instances increases?
- For managing high amounts of traffic, as well as creating manual or automatic snapshots to restore data if the RDS instance fails, a bigger RDS instance type is necessary.

# Which scaling method would you recommend for RDS, and why?
- Vertical scaling and horizontal scaling are the two forms of scaling.
- Vertical scaling allows you to scale up your master database vertically with the click of a button.
- A database can only be scaled vertically, and the RDS may be resized in 18 different ways.
- Horizontal scaling, on the other hand, is beneficial for copies.
- These are read-only replicas that can only be performed with Amazon Aurora.

# How is Amazon RDS, DynamoDB, and Redshift different?
- Amazon RDS is a database management service for relational databases, it manages patching, upgrading, backing up of data etc. of databases for you without your intervention.
- RDS is a DB management service for structured data only.
- DynamoDB, on the other hand, is a NoSQL database service, NoSQL deals with unstructured data.
- Redshift, is an entirely different service, it is a data warehouse product and is used in data analysis.

# If I am running my DB Instance as a Multi-AZ deployment, can I use the standby DB Instance for read or write operations along with the primary DB instance?
- No, Standby DB instance cannot be used with primary DB instance in parallel, as the former is solely used for standby purposes, it cannot be used unless the primary instance goes down.

# Your company’s branch offices are all over the world, they use a software with a multi-regional deployment on AWS, they use MySQL 5.6 for data persistence. The task is to run an hourly batch process and read data from every region to compute cross-regional reports which will be distributed to all the branches. This should be done in the shortest time possible. How will you build the DB architecture in order to meet the requirements?
- For this, we will take an RDS instance as a master, because it will manage our database for us and since we have to read from every region, we’ll put a read replica of this instance in every region where the data has to be read from.

# Can I run more than one DB instance for Amazon RDS for free?
- Yes. You can run more than one Single-AZ Micro database instance, that too for free!
- However, any use exceeding 750 instance hours, across all Amazon RDS Single-AZ Micro DB instances, across all eligible database engines and regions, will be billed at standard Amazon RDS prices.

# Which AWS services will you use to collect and process e-commerce data for near real-time analysis?
- DynamoDB is a fully managed NoSQL database service. DynamoDB, therefore, can be fed any type of unstructured data, which can be data from e-commerce websites as well, and later, an analysis can be done on them using Amazon Redshift.

# Can I retrieve only a specific element of the data, if I have a nested JSON data in DynamoDB?
- Yes. When using the GetItem, BatchGetItem, Query or Scan APIs, you can define a Projection Expression to determine which attributes should be retrieved from the table.
- Those attributes can include scalars, sets, or elements of a JSON document.

# A company is deploying a new two-tier web application in AWS. The company has limited staff and requires high availability, and the application requires complex queries and table joins. Which configuration provides the solution for the company’s requirements?
- DynamoDB has the ability to scale more than RDS or any other relational database service.

# What happens to my backups and DB Snapshots if I delete my DB Instance?
- When you delete a DB instance, you have an option of creating a final DB snapshot, if you do that you can restore your database from that snapshot.
- RDS retains this user-created DB snapshot along with all other manually created DB snapshots after the instance is deleted, also automated backups are deleted and only manually created DB Snapshots are retained.

# Which of the following use cases are suitable for Amazon DynamoDB?
- If all your JSON data have the same fields eg [id,name,age] then it would be better to store it in a relational database, the metadata on the other hand is unstructured, also running relational joins or complex updates would work on DynamoDB as well.

# How can I load my data to Amazon Redshift from different data sources like Amazon RDS, Amazon DynamoDB, and Amazon EC2?
- You can load the data in the following two ways:
  - You can use the COPY command to load data in parallel directly to Amazon Redshift from Amazon EMR, Amazon DynamoDB, or any SSH-enabled host.
  - AWS Data Pipeline provides a high performance, reliable, fault-tolerant solution to load data from a variety of AWS data sources.
- You can use AWS Data Pipeline to specify the data source, desired data transformations, and then execute a pre-written import script to load your data into Amazon Redshift.

# What is an Amazon RDS maintenance window? Will your database instance be available during maintenance?
- You may plan DB instance updates, database engine version upgrades, and software patching using the RDS maintenance window.
- Only upgrades for security and durability are scheduled automatically.
- The maintenance window is set to 30 minutes by default, and the DB instance will remain active throughout these events, but with somewhat reduced performance.

# Your application has to retrieve data from your user’s mobile every 5 minutes and the data is stored in DynamoDB, later every day at a particular time the data is extracted into S3 on a per-user basis and then your application is later used to visualize the data to the user. You are asked to optimize the architecture of the backend system to lower cost, what would you recommend?
- Use ElastiCache to cache the DynamoDB query results in memory instead of using provisioned IOPS.
- This will reduce the provisioned read throughput and hence reduce cost without affecting performance.

# You are running a website on EC2 instances deployed across multiple Availability Zones with a Multi-AZ RDS MySQL Extra Large DB Instance. The site performs a high number of small reads and writes per second and relies on an eventual consistency model. After comprehensive tests, you discover that there is read contention on RDS MySQL. Which are the best approaches to meet these requirements?
- Cache frequently accessed data using ElastiCache to reduce read contention on RDS MySQL.
- Increase the instance size of RDS and introduce provisioned IOPS to improve performance.

# A startup is running a pilot deployment of around 100 sensors to measure street noise and air quality in urban areas for 3 months. It was noted that every month around 4GB of sensor data is generated. The company uses a load-balanced auto-scaled layer of EC2 instances and an RDS database with 500 GB standard storage. The pilot was a success and now they want to deploy at least 100K sensors which need to be supported by the backend. You need to store the data for at least 2 years to analyze it. Which setup would you prefer?
- Use a Redshift cluster to store and analyze the sensor data.
- Redshift is scalable and can handle large workloads efficiently, making it suitable for storing and analyzing the increased data volume.

# Suppose you have an application where you have to render images and also do some general computing. Which service will best fit your need?
- Use an Application Load Balancer.
- An Application Load Balancer supports path-based routing, allowing you to route image rendering tasks to one set of instances and general computing tasks to another set of instances.

# What is the difference between Scalability and Elasticity?
- Scalability refers to the ability of a system to handle an increase in demand by increasing hardware resources or adding processing nodes.
- Elasticity, on the other hand, refers to the ability of a system to automatically scale resources up or down based on demand, and to release resources when they are no longer needed.

# How can an existing instance be added to a new Auto Scaling group?
- Launch the EC2 console.
- Select your instance from the list of Instances.
- Navigate to Actions -> Instance Settings -> Join the Auto Scaling Group.
- Choose a new Auto Scaling group and join the instance to it.
- Modify the instance if necessary.

# How will you change the instance type for instances which are running in your application tier and are using Auto Scaling? Where will you change it from?
- Change the instance type in the auto scaling launch configuration.
- Modify the launch configuration to specify the new instance type for the instances in your application tier.

# You have a content management system running on an Amazon EC2 instance that is approaching 100% CPU utilization. What will reduce the load on the Amazon EC2 instance?
- Create a load balancer and register the Amazon EC2 instance with it.
- Distribute incoming traffic across multiple instances to reduce the load on each instance.

# When should I use a Classic Load Balancer and when should I use an Application load balancer?
- Use a Classic Load Balancer for simple load balancing of traffic across multiple EC2 instances.
- Use an Application Load Balancer for microservices or container-based architectures where there is a need to route traffic to multiple services or load balance across multiple ports on the same EC2 instance.

# What does Connection draining do?
- Connection draining reroutes traffic from instances that are to be updated or have failed a health check.
- It allows in-flight requests to complete before removing instances from service, ensuring a smooth transition.

# When an instance is unhealthy, it is terminated and replaced with a new one, which services does that? 
- Fault Tolerance

# What are lifecycle hooks used for in AutoScaling? 
- They are used to put an additional wait time to a scale in or scale out event.

# A user has setup an Auto Scaling group. Due to some issue the group has failed to launch a single instance for more than 24 hours. What will happen to Auto Scaling in this condition? 
- Auto Scaling will suspend the scaling process

# What is Cloudtrail, and how does it interact with Route 53? 
- CloudTrail is a service that logs every request made to the Amazon Route 53 API by an AWS account, including those made by IAM users.
- CloudTrail stores these requests’ log files to an Amazon S3 bucket. CloudTrail collects data on all requests.
- CloudTrail log files contain information that may be used to discover which requests were submitted to Amazon Route 53, the IP address from which the request was sent, who issued the request, when it was sent, and more.

# How does AWS configuration interact with AWS CloudTrail? 
- AWS CloudTrail logs user API activity on your account and provides you with access to the data.
- CloudTrail provides detailed information on API activities such as the caller’s identity, the time of the call, request arguments, and response elements.
- AWS Config, on the other hand, saves point-in-time configuration parameters for your AWS resources as Configuration Items (CIs).
  - A CI may be used to determine what your AWS resource looks like at any given time.
  - Using CloudTrail, on the other hand, you can instantly determine who made an API request to alter the resource.
  - Cloud Trail may also be used to determine if a security group was wrongly setup.

# You have an EC2 Security Group with several running EC2 instances. You changed the Security Group rules to allow inbound traffic on a new port and protocol, and then launched several new instances in the same Security Group. The new rules apply: 
- Immediately to all instances in the security group.

# To create a mirror image of your environment in another region for disaster recovery, which of the following AWS resources do not need to be recreated in the second region? 
- Route 53 record sets are common assets therefore there is no need to replicate them, since Route 53 is valid across regions

# A customer wants to capture all client connection information from his load balancer at an interval of 5 minutes, what can be done to load balancer? 
- Enable AWS CloudTrail for the load balancer.

# What happens if CloudTrail is turned on for my account but my Amazon S3 bucket is not configured with the correct policy? 
- CloudTrail files are delivered according to S3 bucket policies. If the bucket is not configured or is misconfigured, CloudTrail might not be able to deliver the log files.

# How do I transfer my existing domain name registration to Amazon Route 53 without disrupting my existing web traffic? 
- You will need to get a list of the DNS record data for your domain name first, it is generally available in the form of a “zone file” that you can get from your existing DNS provider.
- Once you receive the DNS record data, you can use Route 53’s Management Console or simple web-services interface to create a hosted zone that will store your DNS records for your domain name and follow its transfer process.
- It also includes steps such as updating the nameservers for your domain name to the ones associated with your hosted zone.
- For completing the process you have to contact the registrar with whom you registered your domain name and follow the transfer process.
- As soon as your registrar propagates the new name server delegations, your DNS queries will start to get answered.

# What services are available for implementing a centralized logging solution? 
- The most important services you may utilize are Amazon CloudWatch Logs, which you can store in Amazon S3 and then display using Amazon Elastic Search.
- To transfer data from Amazon S3 to Amazon ElasticSearch, you can utilize Amazon Kinesis Firehose.

# WHAT EXACTLY ARE SNS AND SQS? 
- Amazon Simple Notification Service (SNS) is a web service that manages user notifications sent from any cloud platform. From any cloud platform, manage and distribute messages or notifications to users and consumers.
- Amazon Simple Queue Service (SQS) administers the queue service, which allows users to move data whether it is running or active.

# What distinguishes AWS CloudFormation from AWS Elastic Beanstalk? 
- AWS CloudFormation assists you in provisioning and describing all infrastructure resources in your cloud environment. AWS Elastic Beanstalk, on the other hand, provides an environment that makes it simple to install and execute cloud applications.
- AWS CloudFormation meets the infrastructure requirements of a wide range of applications, including legacy applications and existing corporate applications. AWS Elastic Beanstalk, on the other hand, is integrated with developer tools to assist you in managing the lifespan of your applications.

# How does Elastic Beanstalk apply updates? 
- Elastic Beanstalk prepares a duplicate copy of the instance before updating the original instance, and routes your traffic to the duplicate instance so that, in case your updated application fails, it will switch back to the original instance, and there will be no downtime experienced by the users who are using your application.

# What happens if my application in Beanstalk stops responding to requests? 
- AWS Beanstalk apps provide a built-in method for preventing infrastructure problems.
- If an Amazon EC2 instance dies for whatever reason, Beanstalk will instantly start a new instance using Auto Scaling.
- Beanstalk can detect if your application is not responding to the custom link.

# How is AWS Elastic Beanstalk different than AWS OpsWorks? 
- AWS Elastic Beanstalk is an application management platform while OpsWorks is a configuration management platform. BeanStalk is an easy to use service which is used for deploying and scaling web applications developed with Java, .Net, PHP, Node.js, Python, Ruby, Go and Docker. Customers upload their code and Elastic Beanstalk automatically handles the deployment. The application will be ready to use without any infrastructure or resource configuration.
- In contrast, AWS Opsworks is an integrated configuration management platform for IT administrators or DevOps engineers who want a high degree of customization and control over operations.

# What happens if my application stops responding to requests in beanstalk? 
- AWS Beanstalk applications have a system in place for avoiding failures in the underlying infrastructure.
- If an Amazon EC2 instance fails for any reason, Beanstalk will use Auto Scaling to automatically launch a new instance.
- Beanstalk can also detect if your application is not responding on the custom link, even though the infrastructure appears healthy, it will be logged as an environmental event(e.g. a bad version was deployed) so you can take appropriate action.

# How is AWS OpsWorks different than AWS CloudFormation?
- OpsWorks and CloudFormation both support application modeling, deployment, configuration, management, and related activities.
- Both support a wide variety of architectural patterns, from simple web applications to highly complex applications.
- AWS CloudFormation is a building block service that enables customers to manage almost any AWS resource via JSON-based domain-specific language.
  - It provides foundational capabilities for the full breadth of AWS without prescribing a particular model for development and operations.
  - Customers define templates and use them to provision and manage AWS resources, operating systems, and application code.
- AWS OpsWorks is a higher-level service that focuses on providing highly productive and reliable DevOps experiences for IT administrators and ops-minded developers.
  - It employs a configuration management model based on concepts such as stacks and layers.
  - Provides integrated experiences for key activities like deployment, monitoring, auto-scaling, and automation.
  - Compared to AWS CloudFormation, AWS OpsWorks supports a narrower range of application-oriented AWS resource types including Amazon EC2 instances, Amazon EBS volumes, Elastic IPs, and Amazon CloudWatch metrics.

# A firm seeking to migrate to the AWS Cloud wants to use its existing Chef recipes for infrastructure configuration management. Which AWS service would be best for this need?
- AWS OpsWorks is a configuration management solution that allows you to use Puppet or Chef to set up and run applications in a cloud organization.

# I created a key in Oregon region to encrypt my data in North Virginia region for security purposes. I added two users to the key and an external AWS account. I wanted to encrypt an object in S3, so when I tried, the key that I just created was not listed.  What could be the reason?  
- The key created and the data to be encrypted should be in the same region. Hence the approach taken here to secure the data is incorrect.

# A company needs to monitor the read and write IOPS for their AWS MySQL RDS instance and send real-time alerts to their operations team. Which AWS services can accomplish this?
- Amazon CloudWatch is a cloud monitoring tool and hence this is the right service for the mentioned use case.
- The other options listed here are used for other purposes, for example, Route 53 is used for DNS services, therefore CloudWatch will be the apt choice.

# What happens when one of the resources in a stack cannot be created successfully in AWS OpsWorks?
- When an event like this occurs, the “automatic rollback on error” feature is enabled, which causes all the AWS resources which were created successfully till the point where the error occurred to be deleted.
- This is helpful since it does not leave behind any erroneous data, it ensures the fact that stacks are either created fully or not created at all.
- It is useful in events where you may accidentally exceed your limit of the no. of Elastic IP addresses or maybe you may not have access to an EC2 AMI that you are trying to run, etc.

# What automation tools can you use to spin up servers?
- Any of the following tools can be used:
  - Roll-your-own scripts, and use the AWS API tools. Such scripts could be written in bash, perl, or another language of your choice.
  - Use a configuration management and provisioning tool like Puppet or its successor Opscode Chef. You can also use a tool like Scalr.
  - Use a managed solution such as Rightscale.

# What is AWS?
- AWS (Amazon Web Services) is a cloud service platform that offers a variety of cloud-based services such as computing power, storage, and database services to businesses, individuals, and governments.

# What is the significance of the Amazon EC2 service in AWS?
- EC2 is a virtual server that enables users to run their applications on a cloud-based infrastructure, allowing access from anywhere and at any time.

# What is Amazon S3 and what is it used for?
- Amazon S3 (Simple Storage Service) is an object storage service used for storing and retrieving data, backup and recovery, and hosting static websites.

# What is Amazon RDS and what is it used for?
- Amazon RDS (Relational Database Service) is a managed database service used for setting up, operating, and scaling relational databases in a cloud environment.

# What is Amazon VPC?
- Amazon VPC (Virtual Private Cloud) is a service that allows users to create a virtual network in the AWS cloud, providing a logically isolated section for launching AWS resources.

# What is Amazon Lambda?
- Amazon Lambda is a serverless computing service used for running code without managing servers, ideal for event-driven applications and real-time stream processing.

# What is Amazon CloudFront?
- Amazon CloudFront is a content delivery network (CDN) service that speeds up the delivery of static and dynamic web content to end users worldwide.

# What is Amazon DynamoDB?
- Amazon DynamoDB is a NoSQL database service providing fast and scalable performance for storing and retrieving any amount of data.

# What is Amazon Redshift and what is it used for?
- Amazon Redshift is a data warehouse service for analyzing large amounts of data using standard SQL queries, commonly used for business intelligence.

# What is AWS IAM?
- AWS IAM (Identity and Access Management) is a service for managing access to AWS resources securely, controlling users, groups, and permissions.

# What is AWS CloudFormation and what is it used for?
- AWS CloudFormation is a service for defining and deploying infrastructure as code, automating the deployment of related AWS resources.

# What is Amazon Elastic Beanstalk and what is it used for?
- Amazon Elastic Beanstalk is a platform as a service (PaaS) for deploying, managing, and scaling applications in the AWS cloud.

# What is Amazon ECS and what is it used for?
- Amazon ECS (Elastic Container Service) is a container management service for running and managing Docker containers on a cluster.

# What is Amazon Route 53 and what is it used for?
- Amazon Route 53 is a highly available DNS service used for registering and managing domain names and routing traffic to AWS resources.

# What is Amazon SQS, and what is it used for?
- Amazon SQS (Simple Queue Service) is a message queuing service for decoupling and scaling distributed systems by transmitting messages asynchronously.

# What is Amazon SNS, and what is it used for?
- Amazon SNS (Simple Notification Service) is a messaging service for sending notifications to mobile devices, email, and other endpoints.

# What is AWS CloudTrail, and what is it used for?
- AWS CloudTrail is a service for governance, compliance, and operational auditing of AWS accounts, providing a record of actions taken within an AWS account.

# What is AWS Elastic Load Balancing, and what is it used for?
- AWS Elastic Load Balancing is a service for automatically distributing incoming application traffic across multiple targets to improve availability and fault tolerance.

# What is Amazon Glacier, and what is it used for?
- Amazon Glacier is a long-term storage service for data archives and backups, providing secure and durable storage at a low cost.

# What is Amazon Kinesis, and what is it used for?
- Amazon Kinesis is a real-time data streaming service for collecting, processing, and analyzing streaming data such as IoT telemetry data and social media feeds.

# What is AWS Direct Connect and what is it used for?
- AWS Direct Connect is a network service for establishing a dedicated network connection from on-premises to AWS, offering a more reliable and secure connection.

# What is Amazon EMR and what is it used for?
- Amazon EMR (Elastic MapReduce) is a managed big data processing service for running Apache Hadoop and Spark on AWS for processing large amounts of data.

# What is Amazon Elastic File System and what is it used for?
- Amazon Elastic File System is a scalable file system for shared access to files across multiple EC2 instances, commonly used for sharing files between applications.

# What is AWS Glue and what is it used for?
- AWS Glue is a fully managed ETL (Extract, Transform, Load) service for discovering, cataloging, and preparing data for analysis.

# What is Amazon CloudWatch and what is it used for?
- Amazon CloudWatch is a monitoring service that provides visibility into the performance of AWS resources and applications.
- It is used for collecting and tracking metrics, monitoring log files, and setting alarms.

# What is Amazon SageMaker and what is it used for?
- Amazon SageMaker is a fully managed machine learning service that makes it easy to build, train, and deploy machine learning models.
- It is used for solving business problems, such as predicting customer behavior and fraud detection.

# What is Amazon Aurora and what is it used for?
- Amazon Aurora is a high-performance and highly available relational database service that is compatible with MySQL and PostgreSQL.
- It is used for running production workloads, such as e-commerce platforms and financial applications.

# What is AWS Step Functions and what is it used for?
- AWS Step Functions is a serverless workflow service that enables users to coordinate the components of distributed applications and microservices.
- It is used for building and running complex workflows that involve multiple AWS services.

# What is AWS Snowball and what is it used for?
- AWS Snowball is a petabyte-scale data transfer service that enables users to transfer large amounts of data into and out of AWS.
- It is used for migrating data to the cloud, creating backups, and archiving data.

# What is Amazon MQ and what is it used for?
- Amazon MQ is a managed message broker service that supports standard messaging protocols such as MQTT and AMQP.
- It is used for decoupling applications and microservices, and for building event-driven architectures.

# What is AWS IoT and what is it used for?
- AWS IoT (Internet of Things) is a platform that enables users to connect and manage IoT devices, and to process and analyze the data generated by these devices.
- It is used for building IoT solutions, such as smart homes and industrial automation.

# What is Amazon WorkSpaces and what is it used for?
- Amazon WorkSpaces is a managed desktop computing service that enables users to provision and manage cloud-based desktops for their employees.
- It is used for providing remote access to applications and data, and for reducing the cost of managing desktops.

# What is AWS Backup and what is it used for?
- AWS Backup is a fully managed backup service that makes it easy to centralize and automate the backup of data across AWS services.
- It is used for backing up data to the cloud, and for restoring data in case of accidental deletion or data loss.

# What is AWS WAF and what is it used for?
- AWS WAF (Web Application Firewall) is a managed service that helps protect web applications from common web exploits that could affect application availability, compromise security, or consume excessive resources.
- It is used for blocking malicious traffic and preventing DDoS attacks.

# What is AWS Certificate Manager and what is it used for?
- AWS Certificate Manager is a service that makes it easy to provision, manage, and deploy SSL/TLS certificates for use with AWS services.
- It is used for securing web applications and improving user trust.

# What is Amazon Neptune and what is it used for?
- Amazon Neptune is a fast, reliable, and scalable graph database service.
- It's optimized for storing and querying highly connected data.
- Used for building recommendation engines, fraud detection systems, and social network applications.

# What is AWS Outposts and what is it used for?
- AWS Outposts is a fully managed service that extends AWS infrastructure and services to customer premises.
- It's used for running applications in locations where full cloud functionality is not available.

# What is Amazon AppStream 2.0 and what is it used for?
- Amazon AppStream 2.0 is a fully managed application streaming service.
- It enables users to stream desktop applications to any device.
- Used for providing secure access to applications from anywhere.

# What is Amazon FSx and what is it used for?
- Amazon FSx is a fully managed file storage service.
- It provides highly scalable and durable file storage for Windows and Lustre workloads.
- Used for storing and accessing files across multiple compute instances.

# What is AWS Firewall Manager and what is it used for?
- AWS Firewall Manager is a security management service.
- It makes it easy to centrally manage firewall rules across multiple AWS accounts and resources.
- Used for enforcing security policies across AWS resources.

# What is AWS Global Accelerator and what is it used for?
- AWS Global Accelerator is a network service.
- It improves the performance of applications by routing traffic over the AWS global network.
- Used for improving the availability and performance of applications.

# What is AWS IoT Device Defender and what is it used for?
- AWS IoT Device Defender is a fully managed service.
- It helps customers secure their IoT devices by continuously monitoring and auditing device configurations.
- Used for detecting and responding to security threats.

# What is Amazon CodeGuru and what is it used for?
- Amazon CodeGuru is a machine learning service.
- It provides automated code reviews and performance recommendations.
- Used for improving code quality and application performance.

# What is AWS Transfer for SFTP and what is it used for?
- AWS Transfer for SFTP is a fully managed service.
- It enables users to transfer files over the Secure File Transfer Protocol (SFTP).
- Used for migrating and sharing data securely.

# What is AWS Elemental Appliance and what is it used for?
- AWS Elemental Appliance is a physical device.
- It provides high-quality video processing for broadcast and multiscreen delivery.
- Used for encoding, decoding, and transcoding video content.

# What is Amazon Elastic Transcoder and what is it used for?
- Amazon Elastic Transcoder is a media transcoding service.
- It enables users to convert media files from one format to another.
- Used for creating adaptive bitrate streaming and video-on-demand content.

# What is AWS Control Tower and what is it used for?
- AWS Control Tower is a service.
- It enables users to set up and govern a multi-account AWS environment.
- Used for automating the creation of new accounts, setting up guardrails, and enforcing security policies.

# What is Amazon EventBridge and what is it used for?
- Amazon EventBridge is a serverless event bus service.
- It enables users to create event-driven architectures.
- Used for building and integrating event-driven applications.

# What is Amazon Pinpoint and what is it used for?
- Amazon Pinpoint is a fully managed service.
- It enables users to engage with their customers through email, SMS, and push notifications.
- Used for improving customer engagement and retention.

# What is AWS App Mesh and what is it used for?
- AWS App Mesh is a service mesh.
- It enables users to control and monitor microservices running on AWS.
- Used for managing and scaling microservices.

# What is Amazon Detective and what is it used for?
- Amazon Detective is a service.
- It enables users to analyze, investigate, and identify the root cause of security issues in their AWS environments.
- Used for identifying and responding to security threats.

# What is Amazon Transcribe and what is it used for?
- Amazon Transcribe is a machine-learning service.
- It converts speech to text.
- Used for transcribing audio and video files, and for improving the accessibility of content.

# What is Amazon Translate and what is it used for?
- Amazon Translate is a machine learning service.
- It provides automatic translation between languages.
- Used for translating text from one language to another.

# What is Amazon Comprehend and what is it used for?
- Amazon Comprehend is a machine learning service.
- It enables users to analyze and understand text.
- Used for analyzing customer feedback, social media posts, and other text-based data sources.

# What is Amazon Lex and what is it used for?
- Amazon Lex is a service.
- It enables users to build conversational interfaces using voice and text.
- Used for building chatbots and voice assistants.

# What is Amazon Polly and what is it used for?
- Amazon Polly is a service.
- It converts text into lifelike speech.
- Used for creating voiceovers, podcasts, and other spoken content.

# What is AWS CloudFormation and what is it used for?
- AWS CloudFormation is a service.
- It enables users to create and manage AWS resources using templates.
- Used for automating the deployment and management of infrastructure.

# What is AWS AppSync and what is it used for?
- AWS AppSync is a managed service.
- It enables users to build GraphQL APIs for their applications.
- Used for building real-time and offline-enabled applications.

# What is AWS IoT SiteWise and what is it used for?
- AWS IoT SiteWise is a service.
- It enables users to collect, organize, and analyze data from industrial equipment.
- Used for optimizing industrial operations and reducing downtime.

# What is Amazon Redshift and what is it used for?
- Amazon Redshift is a data warehousing service.
- It enables users to analyze large amounts of data.
- Used for business intelligence, reporting, and analytics.

# What is AWS Cloud9 and what is it used for?
- AWS Cloud9 is a cloud-based integrated development environment (IDE).
- It enables users to write, run, and debug code from anywhere.
- Used for collaborative development and remote coding.

# What is Amazon Lex V2 and what is it used for?
- Amazon Lex V2 is a service.
- It enables users to build conversational interfaces using voice and text with improved accuracy and natural language understanding.
- Used for building chatbots and voice assistants.

# What is Amazon DevOps Guru and what is it used for?
- Amazon DevOps Guru is a machine learning service.
- It provides automated insights and recommendations for improving application availability and performance.
- Used for optimizing application performance and reducing downtime.

# What is AWS Lambda Layers and what is it used for?
- AWS Lambda Layers is a feature that enables users to manage code and library dependencies separately from their function code.
- It is used for simplifying the development and maintenance of serverless applications.

# What is AWS Data Pipeline and what is it used for?
- AWS Data Pipeline is a managed service that enables users to move and process data between different AWS services and on-premises data sources.
- It is used for data integration, processing, and analysis.

# What is AWS Glue and what is it used for?
- AWS Glue is a fully managed extract, transform, and load (ETL) service that enables users to prepare and load data for analytics.
- It is used for processing and analyzing data from different sources.

# What is Amazon S3 Glacier and what is it used for?
- Amazon S3 Glacier is a low-cost storage service that enables users to archive and retrieve data over longer timescales.
- It is used for long-term backup and archive storage.

# What is AWS Security Hub and what is it used for?
- AWS Security Hub is a security management service that enables users to centrally view and manage security alerts and compliance status across their AWS accounts.
- It is used for improving security and compliance posture.

# What is AWS Direct Connect and what is it used for?
- AWS Direct Connect is a dedicated network connection between AWS and customer premises that enables users to access AWS services without using the public internet.
- It is used for improving network performance and reducing costs.

# What is AWS Organizations and what is it used for?
- AWS Organizations is a service that enables users to manage multiple AWS accounts and resources in a centralized manner.
- It is used for simplifying the management of AWS resources across an organization.

# What is Amazon Simple Notification Service and what is it used for?
- Amazon Simple Notification Service (SNS) is a fully managed messaging service that enables users to send and receive messages from different AWS services and endpoints.
- It is used for sending notifications, alerts, and messages.

# What is Amazon CloudFront and what is it used for?
- Amazon CloudFront is a content delivery network (CDN) service that enables users to deliver static and dynamic web content, including streaming videos and live events, to viewers globally.
- It is used for improving the performance and scalability of web applications.

# What is AWS Service Catalog and what is it used for?
- AWS Service Catalog is a service that enables users to create and manage catalogs of approved IT services that can be deployed to their AWS accounts.
- It is used for simplifying and streamlining the deployment of IT services.

# What is AWS CloudTrail and what is it used for?
- AWS CloudTrail is a service that enables users to log, monitor, and retain events related to their AWS resources and accounts.
- It is used for improving compliance and auditing, and for troubleshooting.

# What is AWS Fargate and what is it used for?
- AWS Fargate is a serverless compute engine for containers that enables users to run containers without managing the underlying infrastructure.
- It is used for deploying and scaling containerized applications.

# What is AWS Cost Explorer and what is it used for?
- AWS Cost Explorer is a service that enables users to view and analyze their AWS costs and usage over time.
- It is used for optimizing AWS spending and identifying cost savings opportunities.

# What is AWS IoT Things Graph and what is it used for?
- AWS IoT Things Graph is a service that enables users to easily and quickly create IoT applications and workflows.
- It is used for building and deploying IoT solutions with minimal coding.

# What is AWS Glue?
- AWS Glue is a fully managed extract, transform, and load (ETL) service provided by Amazon Web Services (AWS).
- It allows users to extract data from various sources, transform it according to predefined business rules, and load it into data lakes, data warehouses, or other data storage solutions.

# What is AWS Glue Data Catalog?
- The AWS Glue Data Catalog is a centralized metadata repository that stores metadata about data sources, transformations, and targets.
- It provides a unified view of data across different AWS services and enables easy discovery, search, and management of metadata.

# Which AWS services and open source projects make use of AWS Glue Data Catalog?
- AWS services like Amazon Athena, Amazon Redshift Spectrum, and AWS Glue itself make use of the AWS Glue Data Catalog.
- Open-source projects such as Apache Spark and Apache Hive can also integrate with the Glue Data Catalog for metadata management.

# What is AWS Glue Crawlers?
- AWS Glue Crawlers are automated processes that scan and infer the schema of data stored in various sources such as Amazon S3, databases, and data warehouses.
- They automatically populate the Glue Data Catalog with metadata information about the data sources they crawl.

# How do you trigger a Glue crawler in AWS Glue?
- You can trigger a Glue crawler either manually from the AWS Management Console or programmatically using the AWS Glue API or AWS Command Line Interface (CLI).
- When configuring the crawler, you specify the data source, the schedule for running the crawler, and other settings.

# What is the purpose of an AWS Glue Job?
- The purpose of an AWS Glue job is to execute ETL (extract, transform, load) operations on data stored in various sources.
- It can perform tasks such as data transformation, data cleaning, and data enrichment before loading the data into a target data store.

# Do the AWS Glue APIs return the partition key fields in the order as they were specified when the table was created?
- Yes, the AWS Glue APIs return the partition key fields in the order as they were specified when the table was created.
- This ensures consistency in how partitioned data is managed and queried.

# How to join / merge all rows of an RDD in PySpark / AWS Glue into one single long line?
- You can use the `reduce` function in PySpark to join or merge all rows of an RDD into one single long line.
- Here's an example:
```python
  from functools import reduce

  merged_line = rdd.reduce(lambda x, y: x + y)
```

# How to create an AWS Glue job using CLI commands?
* You can create an AWS Glue job using the AWS Command Line Interface (CLI) by running the create-job command.
* You need to specify parameters such as the job name, role, and script location.
* Here's an example command:
```python
aws glue create-job --name my-glue-job --role 
arn:aws:iam::123456789012:role/GlueServiceRole --command 
'Name=glueetl,ScriptLocation=s3://my-bucket/scripts/my-script.py'
```

# How to get the total number of partitions in AWS Glue for a specific range?
* You can use the get_partitions method of the Glue API to retrieve information about partitions for a specific range.
* This method allows you to specify parameters such as the database name, table name, and partition range.

# When an AWS Glue job times out, how do we retry it?
* When an AWS Glue job times out, you can configure automatic retries by setting the appropriate parameters in the job definition.
* You can specify the maximum number of retry attempts and the interval between retries.
* AWS Glue will automatically retry the job if it fails due to a timeout, up to the specified number of attempts.

# What are your thoughts on AWS Glue?
- AWS Glue simplifies data categorization, cleaning, and movement across different data stores and streams.
- It consists of the AWS Glue Catalog, a central metadata repository.
- AWS Glue assists in generating Python or Scala code by handling dependency resolution, task monitoring, and retries.
- It is a serverless infrastructure that is easy to set up and manage.
- AWS Glue offers dynamic frames for ETL scripts, similar to Apache Spark dataframes.

# Which Data Stores Can I Crawl using Glue?
- Glue crawlers can crawl both file-based and table-based data stores.
- Supported data stores include Amazon S3, Amazon DynamoDB, Amazon Redshift, Amazon RDS, and others through JDBC connections.

# What components does AWS Glue make use of?
- AWS Glue comprises the Data Catalog, ETL Engine, Flexible Scheduler, AWS Glue DataBrew, and AWS Glue Elastic Views.

# What is AWS Glue DataBrew, and how does it work?
- AWS Glue DataBrew is a visual data preparation solution that allows data analysts and scientists to prepare data without writing code.
- It offers an interactive, point-and-click visual interface to view, clean, and normalize data from various data stores.

# What steps do I need to take to get my metadata into the AWS Glue Data Catalog?
- Metadata can be populated into the AWS Glue Data Catalog using Glue crawlers, AWS Glue Console/API, Amazon EMR clusters, or bulk import from Apache Hive Metastore.

# What steps does AWS Glue take to deduplicate my data?
- AWS Glue uses the FindMatches ML Transform to locate and link records referring to the same entity without a unique identifier.
- FindMatches employs machine learning algorithms to match records based on specific business criteria.

# To use AWS Glue DataBrew, do I need to use AWS Glue Data Catalog or AWS Lake Formation?
- No, AWS Glue DataBrew can be used independently of the AWS Glue Data Catalog or AWS Lake Formation.
- However, if used with either, users can access a centralized data catalog of available datasets.

# What are the benefits of using AWS Glue Schema Registry?
- AWS Glue Schema Registry validates schemas, maintains schema evolution, improves data quality, saves costs, and increases processing speed.

# What are the benefits of using AWS Glue Elastic Views?
- AWS Glue Elastic Views aggregate and replicate data across various data stores in near-real-time.
- They are beneficial for developing new application functionality that requires access to data from multiple existing data stores.

# Which AWS services and open source projects make use of AWS Glue Data Catalog?
- AWS services and open-source projects utilizing the AWS Glue Data Catalog include AWS Lake Formation, Amazon Athena, Amazon Redshift Spectrum, Amazon EMR, and the AWS Glue Data Catalog Client for Apache Hive Metastore.

# When should I employ a Glue Classifier?
- Glue classifiers are used when crawling a data store to define metadata tables in the AWS Glue Data Catalog.
- They determine whether the data has been identified by employing an ordered set of classifiers.

# How can I connect to the AWS Glue Schema Registry in a secure manner?
- You can securely connect to the AWS Glue Schema Registry by configuring an interface VPC endpoint for AWS Glue using AWS PrivateLink.
- This allows communication between your VPC and AWS Glue entirely within the AWS network.

# When a crawler runs, what happens?
- When a crawler runs, it performs actions such as creating custom classifiers, organizing data into tables or partitions, and configuring metadata writes to the Data Catalog.

# When should I utilize Amazon EMR vs. AWS Glue?
- Use AWS Glue for scale-out execution of data transformation activities running on Apache Spark.
- Use Amazon EMR for direct access to your Hadoop environment, enabling access at a lower level and utilization of tools other than Apache Spark.

# What options do I have for customizing the ETL code provided by AWS Glue?
- AWS Glue generates Scala or Python code for ETL tasks using its ETL script suggestion algorithm.
- You can use AWS Glue's library for ETL code or write arbitrary code in Scala or Python using the script editor in the AWS Glue Console.

# How am I charged for AWS Glue?
- You are charged a basic monthly cost for storing and retrieving metadata in the AWS Glue Data Catalog beyond the free tier.
- Crawler runs are billed hourly, per second, with a 10-minute minimum, and development endpoint usage incurs hourly charges, billed per second.
- The ETL process is charged hourly, billed per second, with a 1-minute or 10-minute minimum, depending on the Glue version chosen.

# Is it possible to monitor and troubleshoot AWS Glue ETL operations using the Apache Spark web UI?
- Yes, you can monitor and debug AWS Glue ETL processes and Apache Spark applications using the Apache Spark web UI.
- It allows verification of event chronology, job DAG, SparkSQL query plans, and underlying Spark environmental variables.

# What happens if AWS Glue encounters an ETL error?
- AWS Glue tracks job event metrics and faults and sends alerts to Amazon CloudWatch.
- You can set up actions in response to Glue notifications using CloudWatch, such as triggering AWS Lambda functions.
- Glue retries all failures three times by default before sending an error notification.

# When a glue crawler decides to construct partitions, how does it do so?
- When an AWS Glue crawler encounters multiple folders in an Amazon S3 path, it determines which folders are table partitions and the root of a table.
- The table name is derived from the Amazon S3 prefix or folder name, and partitions are created based on folder structure.

# AWS Glue Elastic Views currently supports which sources and targets?
- AWS Glue Elastic Views supports Amazon DynamoDB for the preview, with support for Amazon Aurora MySQL, Amazon Aurora PostgreSQL, Amazon RDS for MySQL, and Amazon RDS for PostgreSQL to follow.
- Supported targets include Amazon Redshift, Amazon S3, Amazon OpenSearch Service, and upcoming support for Amazon Aurora MySQL, Amazon Aurora PostgreSQL, Amazon RDS for MySQL, and Amazon RDS for PostgreSQL.