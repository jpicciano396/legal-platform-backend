FROM neo4j:latest

COPY plugins/* /plugins/

ENV NEO4J_PLUGINS=["apoc"]
ENV NEO4J_apoc_export_file_enabled=true
ENV NEO4J_apoc_import_file_enabled=true
ENV NEO4J_apoc_import_file_use__neo4j__config=true
