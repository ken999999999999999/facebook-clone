from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(
    prefix="/posts",
    tags=["posts"],
    responses={404: {"description": "Not found"}},
)


fake_posts_db = {"plumbus": {"name": "Plumbus"}, "gun": {"name": "Portal Gun"}}


@router.get("/")
async def read_posts():
    return fake_posts_db


@router.get("/{post_id}")
async def read_post(post_id: str):
    if post_id not in fake_posts_db:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"name": fake_posts_db[post_id]["name"], "post_id": post_id}


@router.put(
    "/{post_id}",
    responses={403: {"description": "Operation forbidden"}},
)
async def update_post(post_id: str):
    if post_id != "plumbus":
        raise HTTPException(
            status_code=403, detail="You can only update the Post: plumbus"
        )
    return {"post_id": post_id, "name": "The great Plumbus"}