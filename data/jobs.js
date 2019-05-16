const mongoCollections = require("../data/collections");
const jobs = mongoCollections.jobs;
const candidate = require("./candidates");
const ObjectID = require('mongodb').ObjectID;
const utils = require("./utils");

function validName(name) {
    if(!utils.isString(name) || utils.isEmpty(name)) {
        return false;
    }

    if(name.length > 50) {
        return false;
    }

    return true;
}

function validDescription(desc) {
    if(!utils.isString(desc) || utils.isEmpty(desc)) {
        return false;
    }

    if(desc.length > 1000) {
        return false;
    }

    return true;
}

function validRate(rate) {
    if(!utils.isString(rate)) {
        return false;
    }

    if(rate.length > 50) {
        return false;
    }

    return true;
}

function validType(type) {
    if(!utils.isString(type) || utils.isEmpty(type)) {
        return false;
    }

    if(type != "part-time" && type != "full-time") {
        return false;
    }

    return true;
}

function validSkill(skill) {
    if(!utils.isObject(skill) || !utils.isString(skill.skill) || utils.isEmpty(skill.skill) || !utils.isString(skill.years) || utils.isEmpty(skill.years) || isNaN(skill.years)) {
        return false;
    }

    if(skill.skill.length > 30 || skill.years < 0.1 || skill.years > 100) {
        return false;
    }

    return true;
}

let exportedMethods = {
    /**
     * Grabs all jobs in the collections sorted by date
     * @return jobs All the jobs in the collection sorted by date
     */
    async getAllJobs() {
        const jobsCollection = await jobs();
        const joblist = await jobsCollection.find({}).toArray();
        return joblist;
    },

    /**
     * Grabs all jobs in the collections sorted by date
     * @return jobs All the jobs in the collection sorted by date
     */
    async getAllOpenJobs() {
        const jobsCollection = await jobs();
        const joblist = await jobsCollection.find({open: true}).toArray();
        return joblist;
    },

    /**
     * Grabs the job with the given job id
     * @param jobId The id of the requested job
     * @return job The job matching the given id
     */
    async getJobById(jobId) {
        if (!jobId) throw "You must provide an id to search for";

        const jobsCollection = await jobs();
        const job = await jobsCollection.findOne({ _id: new ObjectID(jobId) });
        if (job === null) throw "No job with that id";

        return job;
    },

     /**
     * Grabs all jobs for the given owner
     * @param owner The id of the owner
     * @return jobs The jobs for the given owner
     */
    async getJobByOwner(owner) {
        if (!owner) throw "You must provide an owner";

        const jobsCollection = await jobs();
        const joblist = await jobsCollection.find({ "owner": new ObjectID(owner) }).toArray();
        return joblist;
    },

    /**
     * Adds a job of the given object under the given employer id
     * @param employerId The id of the employer that is posting the new job
     * @param newJob The new job object to be added
     * @return added True if the new job was added; False otherwise
     */
    async addJob(employerId, newJob) {
        newJob.owner = employerId;
        /*
        * applicants could be add here or add this attribute when there is a an applicant applying for it
        * */
        //newJob.applicants = [];
        if (!employerId)
            throw "[ERROR] empty employer when[adding new job]";

        if(!validName(newJob.name)) {
            throw "Invalid name"
        }

        if(!validDescription(newJob.description)) {
            throw "Invalid name"
        }

        if(!validRate(newJob.payRate)) {
            throw "Invalid name"
        }

        if(!validType(newJob.type)) {
            throw "Invalid name"
        }

        if(!Array.isArray(newJob.skills)) {
            throw "Invalid skills";
        }

        for(let i = 0; i < newJob.skills.length; i++) {
            if(!validSkill(newJob.skills[i])) {
                throw "Invalid skill"
            }
        }

        newJob.applications = [];
        newJob.open = true;

        const jobsCollection = await jobs();
        const insertInfo = await jobsCollection.insertOne(newJob);
        if (insertInfo.insertedCount === 0) {
            throw "Could not add job";
        }

        return true;
    },

    /**
     * Removes a job with the given job id
     * @param jobId The id of the requested job to be removed
     * @return removed True if the job was removed; False otherwise
     */
    async removeJob(jobId) {
        if (!jobId) throw "You must provide an id to search for";

        const jobsCollection = await jobs();
        const deletionInfo = await jobsCollection.removeOne({ "id": jobId });

        if (deletionInfo.deletedCount === 0) {
            throw `[ERROR] Could not delete job with id of ${jobId}` ;
            return false;
        }
        return true;
    },

    /**
     * Updates a job posting to closed
     * @param jobId The id of the job to be closed
     * @return opened True if the job was closed; False otherwise
     */
    async closeJob(jobId) {
        if (!jobId) throw "You must provide an id to search for";

        const jobsCollection = await jobs();
        const updated = await jobsCollection.updateOne({ _id: new ObjectID(jobId) }, {$set: {open: false}});
        if (updated.result.ok !== 1) {
            throw `[ERROR] Cannot update the job open status`;
        }
        return true;
    },

    /**
     * Updates a job with a new title
     * @param jobId The id for the job to be updated
     * @param newTitle The new title for the requested job
     * @return updated True if the job was updated; False otherwise
     */
    async updateJobTitle(jobId, newTitle) {
        if (!jobId) throw "You must provide an id to search for";

        if(!validName(newTitle)) {
            throw "Invalid name"
        }

        const jobsCollection = await jobs();
        const updatedJob = { name: newTitle };

        const updated = await jobsCollection.updateOne({ _id: new ObjectID(jobId) }, {$set: updatedJob});
        if (updated.result.ok !== 1) {
            throw `[ERROR] Cannot update the job title`;
        }
        return true;
    },

    /**
     * Updates a job with a new description
     * @param jobId The id for the job to be updated
     * @param newDesc The new description for the requested job
     * @return updated True if the job was updated; False otherwise
     */
    async updateJobDesc(jobId, newDesc) {
        if (!jobId) throw "You must provide an id to search for";

        if(!validDescription(newDesc)) {
            throw "Invalid name"
        }

        const jobsCollection = await jobs();
        const updatedJob = { description: newDesc };

        const updated = await jobsCollection.updateOne({ _id: new ObjectID(jobId) }, {$set: updatedJob});
        if (!updated) {
            throw `[ERROR] Cannot update the job description`;
        }
        return true;
    },

    /**
     * Updates a job with a new rate
     * @param jobId The id for the job to be updated
     * @param newRate The new rate for the requested job
     * @return updated True if the job was updated; False otherwise
     */
    async updateJobRate(jobId, newRate) {
        if (!jobId) throw "You must provide an id to search for";

        if(!validRate(newRate)) {
            throw "Invalid name"
        }

        const jobsCollection = await jobs();
        const updatedJob = { payRate: newRate };

        const updated = await jobsCollection.updateOne({ _id: new ObjectID(jobId) }, {$set: updatedJob});
        if (!updated) {
            throw `[ERROR] Cannot update the job description`;
        }
        return true;
    },

    /**
     * Updates a job with a new type
     * @param jobId The id for the job to be updated
     * @param newType The new type for the requested job
     * @return updated True if the job was updated; False otherwise
     */
    async updateJobType(jobId, newType) {
        if (!jobId) throw "You must provide an id to search for";

        if(!validType(newType)) {
            throw "Invalid name"
        }

        const jobsCollection = await jobs();
        const updatedJob = { type: newType };

        const updated = await jobsCollection.updateOne({ _id: new ObjectID(jobId) }, {$set: updatedJob});
        if (!updated) {
            throw `[ERROR] Cannot update the job description`;
        }
        return true;
    },

    /**
     * Add the given skills to a job
     * @param jobId The id for the job to be updated
     * @param newSkills The new skills for the requested job
     * @return updated True if the job was updated; False otherwise
     */
    async updateJobSkills(jobId, newSkills) {
        if (!jobId) throw "You must provide an id to search for";

        if(!Array.isArray(newSkills)) {
            throw "Invalid skills";
        }

        for(let i = 0; i < newSkills.length; i++) {
            if(!validSkill(newSkills[i])) {
                throw "Invalid skill"
            }
        }

        const jobsCollection = await jobs();
        const updatedJob = { skills: newSkills };

        const updated = await jobsCollection.updateOne({ _id: new ObjectID(jobId) }, {$set: updatedJob});
        if (!updated) {
            throw `[ERROR] Cannot update the job skills`;
        }
        return true;
    },

    // Add candidate to the job's application list
    async addApplication(jobId, candidateId) {
        if (!jobId || !candidateId) throw "You must provide IDs";

        const jobsCollection = await jobs();
        const job = await jobsCollection.findOne({ _id: new ObjectID(jobId) });
        if(!job) {
            throw "Invalid jobId"
        }

        if(job.applications.includes(candidateId.toString())) {
            // Already exists
            return false;
        }

        const updated = await jobsCollection.updateOne({ _id: new ObjectID(jobId) }, {$push: { applications: candidateId.toString() }});
        if (!updated) {
            throw `[ERROR] Cannot update the job skills`;
        }
        return true;
    },

    /*
    * searches jobs with a keyword list for a specific candidate
    * @param keyword list
    * @param candidate ID for checking whether the job has been applied by the candidate or not
    * @return a jobs list; each job object has a new attribute of applied flag
    * */
    async searchJobsBykeywordAndId(keywordList, candidateID) {
        if (!keywordList || !candidateID)
            throw "[ERROR] [searchJobByKeyword] parameters are wrong"

        const allJobs = await getAllJobs();
        // let applicant = await candidate.getCandidateById(candidateID);
        let keyworSplit = keywordList.split(' ');

        let matchedJobs = allJobs.filter(x => {
            for (let keyword in keyworSplit) {
                if (JSON.stringify(x.skills).toLocaleLowerCase().indexOf(keyworSplit[keyword] === -1))
                    return false;
            }
            return true;
        });

        if (matchedJobs.length() === 0){
            console.log("[WARNING] Empty result of searching jobs by keywords");
        }


        for (let indexOfJobs in matchedJobs) {
            matchedJobs[indexOfJobs].applied = matchedJobs[indexOfJobs].applicants.indexOf(candidateID) !== -1;
        }

        return matchedJobs;
    }
};

module.exports = exportedMethods;
