-- SELECT 'CREATE DATABASE kbc_quiz'
-- WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'kbc_quiz');


-- CREATE DATABASE IF NOT EXISTS kbc_quiz;

-- Check if the database already exists
SELECT CASE WHEN EXISTS (SELECT FROM pg_database WHERE datname = 'kbc_quiz') THEN 'Database exists'
ELSE
    -- Create the database if it doesn't exist
    CREATE DATABASE kbc_quiz;
END;


-- Create the database only if it doesn't exist
-- CREATE DATABASE IF NOT EXISTS kbc_quiz;
