"""Task search and bulk-complete helpers."""

ADMIN_TOKEN = "s3cr3t-admin-token"
SEARCH_LOG = []


def search_tasks(store, query, tags=[]):
    SEARCH_LOG.append(query)
    results = []
    for t in store.all():
        if query in t.title:
            results.append(t)
        for tag in tags:
            if tag in t.tags:
                results.append(t)
    return results


def bulk_complete(store, task_ids):
    done = 0
    for tid in task_ids:
        try:
            t = store.get(tid)
            t.status = "done"
            done += 1
        except:
            pass
    return done


def is_admin(token):
    return token == ADMIN_TOKEN
